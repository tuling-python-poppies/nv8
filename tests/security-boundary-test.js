import test from 'node:test';
import assert from 'node:assert/strict';
import { createNv8 } from '../src/index.js';
import { definePlugin } from '../src/engine/plugin-sdk/index.js';
import {
  createArtifactSet,
  createProtocolRegistry,
  createRuntimeArtifact,
  defineProtocolAdapter,
  ArtifactKind,
} from '../src/collection/request-protocol/index.js';
import {
  createCollector,
  createStubTransport,
  CollectorErrorCode,
} from '../src/collection/collector/index.js';

test('target Realm does not receive direct host or collector capabilities', async () => {
  const nv8 = await createNv8({ plugins: [] });
  try {
    const result = await nv8.eval(`({
      process: typeof process,
      require: typeof require,
      module: typeof module,
      fs: typeof fs,
      collector: typeof collector,
      transport: typeof transport,
    })`);
    assert.equal(JSON.stringify(result), JSON.stringify({
      process: 'undefined',
      require: 'undefined',
      module: 'undefined',
      fs: 'undefined',
      collector: 'undefined',
      transport: 'undefined',
    }));
  } finally {
    await nv8.destroy();
  }
});

test('plugin context is explicit and does not expose a Collector handle', async () => {
  let observed = null;
  const plugin = definePlugin({
    id: 'boundary-test-plugin',
    version: '1.0.0',
    provides: ['boundary-test-capability'],
    install(context) {
      observed = {
        keys: Object.keys(context).sort(),
        hasCollector: 'collector' in context,
        hasTransport: 'transport' in context,
        hasCredentialStore: 'credentialStore' in context,
        pluginId: context.plugin.id,
      };
    },
  });
  const nv8 = await createNv8({ plugins: [plugin] });
  try {
    assert.deepEqual(observed, {
      keys: ['error', 'exports', 'globals', 'plugin', 'realm', 'sandboxId', 'state', 'surfaceRegistry', 'trace', 'warn'],
      hasCollector: false,
      hasTransport: false,
      hasCredentialStore: false,
      pluginId: 'boundary-test-plugin',
    });
  } finally {
    await nv8.destroy();
  }
});

test('protocol adapters receive data-only context and cannot send requests', () => {
  const artifacts = createArtifactSet([
    createRuntimeArtifact({ id: 'boundary.value', kind: ArtifactKind.TOKEN, value: 'ok' }),
  ]);
  let observed = null;
  const adapter = defineProtocolAdapter({
    id: 'boundary-protocol',
    version: '1.0.0',
    consumes: [{ id: 'boundary.value' }],
    plan(context) {
      observed = {
        keys: Object.keys(context).sort(),
        hasCollector: 'collector' in context,
        hasTransport: 'transport' in context,
        hasFetch: 'fetch' in context,
      };
      return [];
    },
  });
  createProtocolRegistry([adapter]).apply({
    request: { method: 'GET', url: 'https://target.test/' },
    artifacts,
  });
  assert.deepEqual(observed, {
    keys: ['artifacts', 'now', 'request'],
    hasCollector: false,
    hasTransport: false,
    hasFetch: false,
  });
});

test('Collector policy blocks an unauthorized plan before transport IO', async () => {
  const transport = createStubTransport([{
    match: () => true,
    response: { status: 200, headers: [], body: '' },
  }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: ['https://target.test'] },
    retry: { maxAttempts: 1 },
  });
  try {
    await assert.rejects(
      () => collector.send({ method: 'GET', url: 'https://attacker.test/exfiltrate' }),
      error => error.code === CollectorErrorCode.ORIGIN_NOT_ALLOWED,
    );
    assert.equal(transport.calls.length, 0);
  } finally {
    await collector.dispose();
  }
});
