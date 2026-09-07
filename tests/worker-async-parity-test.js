import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createSandbox } from '../src/public/create-sandbox.js';
import {
  ASYNC_BEHAVIOR_PROBES,
  buildAsyncProbeExpression,
} from '../src/infra/baseline/async-behavior-probes.js';

const fixture = JSON.parse(await readFile(
  new URL('../fixtures/fingerprint/edge-async-behavior.json', import.meta.url),
  'utf8',
));

const replay = [
  {
    method: 'GET',
    url: 'https://example.test/worker-message.js',
    repeat: 'unlimited',
    body: 'postMessage("ready");',
  },
  {
    method: 'GET',
    url: 'https://example.test/worker-late.js',
    repeat: 'unlimited',
    body: 'setTimeout(() => postMessage("late"), 0);',
  },
  {
    method: 'GET',
    url: 'https://example.test/worker-sentinel.js',
    repeat: 'unlimited',
    body: 'postMessage("sentinel");',
  },
];

let observedPromise;
function observe() {
  observedPromise ??= (async () => {
    const sandbox = await createSandbox('https://example.test/app/page', {
      replay,
      limits: { timeoutMs: 30_000 },
    });
    try {
      return JSON.parse(await sandbox.run(buildAsyncProbeExpression()));
    } finally {
      await sandbox.close();
      createSandbox.drain();
    }
  })();
  return observedPromise;
}

test('async Worker fixture matches real Edge', async () => {
  assert.equal(fixture.probeCount, ASYNC_BEHAVIOR_PROBES.length);
  const observed = await observe();
  const failures = [];
  for (const probe of ASYNC_BEHAVIOR_PROBES) {
    assert.ok(fixture.results[probe.id] !== undefined, `missing ${probe.id}`);
    if (JSON.stringify(fixture.results[probe.id]) !== JSON.stringify(observed[probe.id])) {
      failures.push({
        id: probe.id,
        expected: fixture.results[probe.id],
        actual: observed[probe.id],
      });
    }
  }
  assert.deepEqual(failures, []);
});

test('async Worker probes are stable across repeated NV8 runs', async () => {
  const first = await observe();
  const sandbox = await createSandbox('https://example.test/app/page', {
    replay,
    limits: { timeoutMs: 30_000 },
  });
  try {
    const second = JSON.parse(await sandbox.run(buildAsyncProbeExpression()));
    assert.deepEqual(second, first);
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
