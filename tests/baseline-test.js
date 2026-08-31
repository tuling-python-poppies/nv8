import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createSandbox } from '../src/public/create-sandbox.js';
import { createNv8, domPreset } from '../src/index.js';
import { fetchPlugin } from '../src/plugins/fetch/index.js';
import { streamsPlugin } from '../src/plugins/streams/index.js';
import { storagePlugin } from '../src/plugins/storage/index.js';
import { messagingPlugin } from '../src/plugins/messaging/index.js';
import { workerPlugin } from '../src/plugins/worker/index.js';
import {
  captureCoreGate0Baseline,
  capturePublicGate0Baseline,
  compareGate0Baselines,
  baselineScenario,
} from '../src/baseline/baseline.js';

const quietLogger = { info() {}, warn() {}, error() {}, trace() {} };
const fixture = JSON.parse(await readFile(
  new URL('../fixtures/baseline/basic.json', import.meta.url),
  'utf8',
));

function assertBaselineShape(baseline, mode) {
  assert.equal(baseline.scenario.htmlSha256, fixture.scenario.htmlSha256);
  assert.deepEqual(baseline.scenario.replay, fixture.scenario.replay);
  assert.equal(baseline.schema, 'nv8.baseline.baseline/v1');
  assert.equal(baseline.mode, mode);
  assert.match(baseline.scenario.htmlSha256, /^[a-f0-9]{64}$/);
  assert.equal(baseline.evaluation.title, 'Baseline');
  assert.equal(baseline.evaluation.text, 'baseline');
  assert.deepEqual(baseline.evaluation.replay, { ok: true, source: 'replay' });
  assert.equal(baseline.evaluation.mutation, 'dynamic');
  assert.equal(baseline.evaluation.worker, 'baseline-worker');
  assert.deepEqual(
    baseline.evaluation.iframe,
    fixture.expected.evaluation.iframe,
  );
  assert.deepEqual(
    baseline.reset,
    mode === 'legacy' ? ['written', null] : [null, null],
  );
  assert.equal(typeof baseline.surface.globals.document, 'string');
  assert.equal(typeof baseline.surface.globals.fetch, 'string');
}

test('Baseline captures a deterministic legacy baseline', async () => {
  const scenario = baselineScenario();
  let sandbox;
  try {
    sandbox = await createSandbox(scenario.url, {
      page: { html: scenario.html },
      replay: scenario.replay,
      // 全表面自省是重型操作。默认 `limits.timeoutMs` 是 1000ms——那是给
      // 不受信页面脚本的生产安全上限，不是「自省该有多快」的断言。绑在默认值上
      // 会让测试在并行负载下随机超时（与固定 sleep 同类的时长赌注）。
      limits: { timeoutMs: 30_000 },
    });
    const baseline = await capturePublicGate0Baseline(sandbox, scenario);
    assertBaselineShape(baseline, 'legacy');
    assert.equal(baseline.inspect, null);
  } finally {
    await sandbox?.close();
    createSandbox.drain();
  }
});

test('Baseline captures a deterministic plugin baseline', async () => {
  const scenario = baselineScenario();
  let nv8;
  try {
    nv8 = await createNv8({
      plugins: [...domPreset, streamsPlugin, storagePlugin, fetchPlugin, messagingPlugin, workerPlugin],
      profile: { id: 'baseline-plugin', version: '1.0.0', name: 'Test Profile', url: scenario.url, pageHtml: scenario.html },
      replay: scenario.replay,
      logger: quietLogger,
    });
    const baseline = await captureCoreGate0Baseline(nv8, scenario);
    assertBaselineShape(baseline, 'plugin');
    assert.equal(baseline.inspect.profile, 'baseline-plugin');
    assert.ok(baseline.inspect.realmCount >= 0);
  } finally {
    await nv8?.destroy();
  }
});

test('Baseline comparison reports explicit compatibility differences', async () => {
  const scenario = baselineScenario();
  let legacySandbox;
  let legacy;
  let plugin;
  let nv8;
  try {
    legacySandbox = await createSandbox(scenario.url, {
      page: { html: scenario.html },
      replay: scenario.replay,
      // 同上：重型自省不能绑在 1000ms 的生产安全上限上
      limits: { timeoutMs: 30_000 },
    });
    nv8 = await createNv8({
      plugins: [...domPreset, streamsPlugin, storagePlugin, fetchPlugin, messagingPlugin, workerPlugin],
      profile: { id: 'baseline-plugin', version: '1.0.0', name: 'Test Profile', url: scenario.url, pageHtml: scenario.html },
      replay: scenario.replay,
      logger: quietLogger,
    });
    legacy = await capturePublicGate0Baseline(legacySandbox, scenario);
    plugin = await captureCoreGate0Baseline(nv8, scenario);
    const comparison = compareGate0Baselines(legacy, plugin);
    assert.equal(typeof comparison.equal, 'boolean');
    assert.ok(Array.isArray(comparison.differences));
    assert.ok(comparison.differences.every(item => typeof item.path === 'string'));
    const approvedPaths = new Set(
      fixture.expected.approvedDifferences.map(item => item.path),
    );
    assert.ok(comparison.differences.every(item => approvedPaths.has(item.path)));
  } finally {
    await legacySandbox?.close();
    await nv8?.destroy();
    createSandbox.drain();
  }
});
