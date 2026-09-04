/**
 * Gate 5 end-to-end test
 *
 * 验证完整链路：
 *   Evidence Bundle (离线) -> NV8 Runtime (执行目标脚本)
 *     -> Runtime Artifact -> Protocol (请求变换)
 *     -> RequestPlan -> Collector (受策略约束的真实出口)
 *
 * 同时验证边界：
 * - 沙箱内脚本无法访问真实网络
 * - Protocol 无法发起请求
 * - Collector 是唯一出口，且受 allowlist 约束
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ArtifactKind,
  createArtifactSet,
  createProtocolRegistry,
  createRequestPlan,
  createRuntimeArtifact,
  createTransform,
  defineProtocolAdapter,
  getCookie,
  getHeader,
  protocolResultToJSON,
} from '../src/collection/request-protocol/index.js';

import {
  CollectorErrorCode,
  createCollector,
  createStubTransport,
} from '../src/collection/collector/index.js';

import { createNv8 } from '../src/index.js';

const ORIGIN = 'https://target.test';

/**
 * 目标站点的签名逻辑。真实场景来自 Evidence Bundle 中的脚本；
 * 这里内联一段等价实现，以保持测试离线且确定。
 */
const TARGET_SIGNER_SOURCE = `
  (function () {
    function fnv1a(input) {
      var hash = 0x811c9dc5;
      for (var i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0;
      }
      return hash.toString(16).padStart(8, '0');
    }

    var payload = JSON.stringify({ uid: 42, action: 'query' });
    var timestamp = 1700000000000;
    globalThis.__result = {
      signature: fnv1a(payload + ':' + timestamp),
      timestamp: timestamp,
      payload: payload,
    };
    return globalThis.__result;
  })()
`;

/** 站点协议适配器：把签名工件写入 header、cookie 和 query */
function targetProtocolAdapter() {
  return defineProtocolAdapter({
    id: 'target-signer',
    version: '1.0.0',
    description: 'target.test request signing',
    consumes: [
      { id: 'target.signature' },
      { id: 'target.timestamp' },
      { kind: ArtifactKind.FINGERPRINT, optional: true },
    ],
    plan: ({ artifacts }) => {
      const signature = artifacts.require('target.signature');
      const timestamp = artifacts.require('target.timestamp');
      const transforms = [
        createTransform('set-header', { name: 'X-Signature', value: signature.value }),
        createTransform('set-header', { name: 'X-Timestamp', value: String(timestamp.value) }),
        createTransform('set-query', { name: '_sign', value: signature.value }),
        createTransform('set-cookie', { name: 'sig_ts', value: String(timestamp.value) }),
      ];

      const fingerprint = artifacts.byKind(ArtifactKind.FINGERPRINT)[0];
      if (fingerprint) {
        transforms.push(createTransform('set-header', {
          name: 'X-Fingerprint',
          value: fingerprint.value.id,
        }));
      }
      return transforms;
    },
  });
}

/**
 * 在 NV8 沙箱内执行目标脚本，把结果提升为运行时工件。
 */
async function runTargetScript() {
  const nv8 = await createNv8();
  try {
    const result = await nv8.eval(TARGET_SIGNER_SOURCE);
    return {
      signature: result.signature,
      timestamp: result.timestamp,
      payload: result.payload,
    };
  } finally {
    await nv8.destroy();
  }
}

function artifactsFrom(runtimeResult) {
  return createArtifactSet([
    createRuntimeArtifact({
      id: 'target.signature',
      kind: ArtifactKind.SIGNATURE,
      value: runtimeResult.signature,
      producer: 'target-signer-script',
      createdAt: runtimeResult.timestamp,
    }),
    createRuntimeArtifact({
      id: 'target.timestamp',
      kind: ArtifactKind.TOKEN,
      value: runtimeResult.timestamp,
      producer: 'target-signer-script',
      createdAt: runtimeResult.timestamp,
    }),
  ]);
}

// ------------------------------------------------------------------ e2e flow

test('runtime produces a deterministic signature artifact', async () => {
  const first = await runTargetScript();
  const second = await runTargetScript();

  assert.match(first.signature, /^[0-9a-f]{8}$/);
  assert.equal(first.signature, second.signature, 'signing must be deterministic');

  const artifacts = artifactsFrom(first);
  assert.equal(artifacts.size, 2);
  assert.equal(
    artifacts.digest(),
    artifactsFrom(second).digest(),
    'artifact digest must be stable for identical runtime output'
  );
});

test('protocol turns runtime artifacts into request transforms', async () => {
  const runtimeResult = await runTargetScript();
  const registry = createProtocolRegistry([targetProtocolAdapter()]);

  const result = registry.apply({
    request: { method: 'POST', url: `${ORIGIN}/api/query`, body: runtimeResult.payload },
    artifacts: artifactsFrom(runtimeResult),
    now: runtimeResult.timestamp + 1000,
  });

  assert.equal(getHeader(result.plan, 'x-signature'), runtimeResult.signature);
  assert.equal(getHeader(result.plan, 'x-timestamp'), String(runtimeResult.timestamp));
  assert.equal(getCookie(result.plan, 'sig_ts'), String(runtimeResult.timestamp));
  assert.ok(result.plan.url.includes(`_sign=${runtimeResult.signature}`));

  // 每个 transform 都可溯源到适配器
  assert.equal(result.transforms.length, 4);
  for (const transform of result.transforms) {
    assert.equal(transform.source, 'target-signer');
  }
  assert.equal(result.conflicts.length, 0);
});

test('collector executes the protocol plan through the only network egress', async () => {
  const runtimeResult = await runTargetScript();
  const registry = createProtocolRegistry([targetProtocolAdapter()]);
  const protocolResult = registry.apply({
    request: { method: 'POST', url: `${ORIGIN}/api/query`, body: runtimeResult.payload },
    artifacts: artifactsFrom(runtimeResult),
  });

  const transport = createStubTransport([{
    match: (request) =>
      request.method === 'POST' && request.url.startsWith(`${ORIGIN}/api/query`),
    respond: (request) => {
      // 服务端校验签名确实到达
      const signature = request.headers
        .find((header) => header.name === 'x-signature')?.values[0];
      return signature === runtimeResult.signature
        ? { status: 200, headers: [{ name: 'content-type', values: ['application/json'] }], body: '{"ok":true}' }
        : { status: 403, headers: [], body: 'bad signature' };
    },
  }]);

  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 1 },
  });

  try {
    const result = await collector.send(protocolResult.plan);
    assert.equal(result.response.status, 200);
    assert.equal(result.response.body, '{"ok":true}');
    assert.equal(transport.calls.length, 1);
  } finally {
    await collector.dispose();
  }
});

// -------------------------------------------------------------- boundaries

test('sandbox scripts cannot reach the real network', async () => {
  const nv8 = await createNv8();
  try {
    // 默认 Profile 下 fetch 要么不存在，要么只能命中离线 replay。
    // 无论哪种，都不得产生真实远程响应。
    const outcome = await nv8.eval(`
      (async function () {
        if (typeof fetch !== 'function') return { kind: 'absent' };
        try {
          const response = await fetch('https://target.test/api');
          return { kind: 'resolved', status: response.status };
        } catch (error) {
          return { kind: 'rejected', message: String(error && error.message) };
        }
      })()
    `);

    assert.notEqual(
      outcome.kind,
      'resolved',
      'target script must not obtain a real network response'
    );
  } finally {
    await nv8.destroy();
  }
});

test('protocol adapters have no way to perform IO', () => {
  const registry = createProtocolRegistry([targetProtocolAdapter()]);
  const artifacts = createArtifactSet([
    createRuntimeArtifact({ id: 'target.signature', kind: ArtifactKind.SIGNATURE, value: 'a' }),
    createRuntimeArtifact({ id: 'target.timestamp', kind: ArtifactKind.TOKEN, value: 1 }),
  ]);

  let observedContextKeys = null;
  const inspector = defineProtocolAdapter({
    id: 'context-inspector',
    version: '1.0.0',
    consumes: [],
    plan: (context) => {
      observedContextKeys = Object.keys(context).sort();
      return [];
    },
  });

  createProtocolRegistry([inspector]).apply({
    request: { method: 'GET', url: `${ORIGIN}/x` },
    artifacts,
  });

  // 适配器只能看到 request / artifacts / now，拿不到 transport、collector 或 fs
  assert.deepEqual(observedContextKeys, ['artifacts', 'now', 'request']);
  assert.equal(registry.size, 1);
});

test('collector allowlist stops a protocol plan aimed at an unauthorized origin', async () => {
  const exfiltrator = defineProtocolAdapter({
    id: 'exfiltrator',
    version: '1.0.0',
    consumes: [{ id: 'target.signature' }],
    // 模拟恶意适配器：把签名重定向到外部域
    plan: () => [createTransform('set-path', { path: '/collect' })],
  });

  const artifacts = createArtifactSet([
    createRuntimeArtifact({ id: 'target.signature', kind: ArtifactKind.SIGNATURE, value: 'leak' }),
  ]);

  const result = createProtocolRegistry([exfiltrator]).apply({
    request: { method: 'GET', url: 'https://attacker.test/x' },
    artifacts,
  });

  const transport = createStubTransport([{ match: () => true, response: { status: 200, headers: [], body: '' } }]);
  const collector = createCollector({
    transport,
    policy: { enabled: true, allowedOrigins: [ORIGIN] },
    retry: { maxAttempts: 1 },
  });

  try {
    await assert.rejects(
      () => collector.send(result.plan),
      (error) => error.code === CollectorErrorCode.ORIGIN_NOT_ALLOWED
    );
    assert.equal(transport.calls.length, 0, 'no packet may leave for a denied origin');
  } finally {
    await collector.dispose();
  }
});

test('the full chain is reproducible via a stable digest', async () => {
  const runtimeResult = await runTargetScript();
  const build = () => createProtocolRegistry([targetProtocolAdapter()]).apply({
    request: { method: 'POST', url: `${ORIGIN}/api/query`, body: runtimeResult.payload },
    artifacts: artifactsFrom(runtimeResult),
    now: runtimeResult.timestamp,
  });

  const first = build();
  const second = build();

  assert.equal(first.digest, second.digest, 'chain digest must be reproducible');
  assert.equal(first.plan.digest, second.plan.digest);
  assert.equal(first.artifactsDigest, second.artifactsDigest);
  assert.equal(first.transformsDigest, second.transformsDigest);

  // 可序列化快照便于存档与回归对比
  const snapshot = protocolResultToJSON(first);
  assert.equal(snapshot.plan.method, 'POST');
  assert.equal(JSON.parse(JSON.stringify(snapshot)).digest, first.digest);
});
