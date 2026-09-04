/**
 * 完整 surface Baseline 测试
 *
 * 与 `baseline-surface-test.js` 的分工：那份检查精选 24 全局的冒烟快照，
 * 这份检查**全部**全局及原型成员，是切换默认模式的前置验收。
 *
 * 关键点：fixture 按 Node major 分档。同一份 NV8 代码在 Node 18/20 与 22/24
 * 上暴露的 surface 确实不同（`Iterator` 等），塞进同一份 fixture 会跨版本误报。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import process from 'node:process';

import {
  FULL_SURFACE_SCHEMA,
  captureFullSurface,
  diffFullSurface,
  summarizeFullSurface,
} from '../src/infra/baseline/full-surface.js';
import {
  LEGACY_PLUGIN_DIFFERENCES,
  NODE_VERSION_DEPENDENT_GLOBALS,
  SEVERITY,
  blockingDifferences,
  expectedMissingForNode,
  validateDifferenceRegistry,
} from '../src/infra/baseline/known-differences.js';

const fixture = JSON.parse(await readFile(
  new URL('../fixtures/baseline/full-surface.json', import.meta.url),
  'utf8',
));

const silentLogger = { info() {}, warn() {}, error() {}, trace() {} };

function surfaceTier(nodeVersion = process.versions.node) {
  const major = Number(/^(\d+)/.exec(nodeVersion)?.[1] ?? 0);
  return `node${major}`;
}

// ------------------------------------------------------------- 差异清单自身

test('difference registry is internally consistent', () => {
  assert.deepEqual(
    validateDifferenceRegistry(),
    [],
    'every registered difference needs id/field/owner/reason/expectation and a valid severity'
  );
});

test('every registered difference carries an owner and expectation', () => {
  assert.ok(LEGACY_PLUGIN_DIFFERENCES.length > 0);
  for (const entry of LEGACY_PLUGIN_DIFFERENCES) {
    assert.ok(entry.owner.length > 0, `${entry.id} needs an owner`);
    assert.ok(
      entry.expectation.length > 10,
      `${entry.id} needs a substantive expectation, not a placeholder`
    );
  }
});

test('node-version-dependent globals resolve against the running runtime', () => {
  const major = Number(/^(\d+)/.exec(process.versions.node)[1]);
  for (const entry of NODE_VERSION_DEPENDENT_GLOBALS) {
    const hit = expectedMissingForNode(entry.name);
    if (major < entry.minimumNodeMajor) {
      assert.ok(hit, `${entry.name} should be reported missing on Node ${major}`);
      assert.equal(hit.severity, SEVERITY.ENVIRONMENTAL);
    } else {
      assert.equal(hit, null, `${entry.name} exists on Node ${major}, must not be exempt`);
    }
  }
});

test('blocking differences are surfaced rather than hidden', () => {
  const blocking = blockingDifferences();
  for (const entry of blocking) {
    assert.equal(entry.severity, SEVERITY.BLOCKING);
    assert.ok(entry.reason.length > 20, `${entry.id} needs a concrete reason`);
  }
  // 按 ADR-0001，覆盖差距不再是 blocking——legacy 与 plugin 是并存的两个
  // 产品形态。切换门槛改为缺失能力可诊断（ADR-0002）。
  assert.deepEqual(
    blocking.map((entry) => entry.id),
    [],
    'no baseline difference should block the switch; the gate is capability diagnostics'
  );
});

// ----------------------------------------------------------------- fixture

test('fixture records a tier for the running Node major', () => {
  const tier = surfaceTier();
  assert.ok(
    fixture.tiers?.[tier],
    `fixture is missing tier ${tier}; run scripts/capture-full-surface.mjs --write on this Node`
  );
});

test('fixture tiers use the current snapshot schema', () => {
  for (const [tier, entry] of Object.entries(fixture.tiers)) {
    for (const mode of ['legacy', 'plugin']) {
      assert.equal(
        entry[mode].schema,
        FULL_SURFACE_SCHEMA,
        `${tier}/${mode} uses a stale schema`
      );
    }
  }
});

test('fixture confirms the legacy surface is substantially larger than plugin', () => {
  const recorded = fixture.tiers[surfaceTier()];
  assert.ok(
    recorded.legacy.globalCount > recorded.plugin.globalCount,
    'expected the recorded coverage gap'
  );
  const gap = LEGACY_PLUGIN_DIFFERENCES.find((e) => e.id === 'surface-coverage-gap');
  assert.ok(gap, 'the coverage gap must stay registered while it exists');
  // 登记保留的目的是监控差距**意外扩大**，而不是把它当待办
  assert.equal(gap.severity, SEVERITY.TRACKED);
});

// ------------------------------------------------------------ 实时采集对比

test('legacy surface matches the recorded baseline', async () => {
  const { createSandbox } = await import('../src/public/create-sandbox.js');
  const sandbox = await createSandbox('https://baseline.test/', {
    page: { html: '<!doctype html><html><head></head><body></body></html>' },
      // 全表面自省是重型操作。默认 `limits.timeoutMs` 是 1000ms——那是给
      // 不受信页面脚本的生产安全上限，不是「自省该有多快」的断言。绑在默认值上
      // 会让测试在并行负载下随机超时（与固定 sleep 同类的时长赌注）。
    limits: { maxOutputBytes: 8 * 1024 * 1024, timeoutMs: 30_000 },
  });

  try {
    const actual = summarizeFullSurface(
      await captureFullSurface((source) => sandbox.run(source))
    );
    const recorded = fixture.tiers[surfaceTier()].legacy;
    const diff = diffFullSurface(recorded, actual);

    // Node 版本造成的缺失是预期的，不算回归
    const unexplained = diff.missing.filter(
      (name) => expectedMissingForNode(name) === null
    );

    assert.deepEqual(unexplained, [], 'globals disappeared without a registered reason');
    assert.deepEqual(diff.added, [], 'new globals appeared; update the fixture deliberately');
    assert.deepEqual(
      diff.changed.map((entry) => entry.name),
      [],
      'global descriptors changed; explain or re-record the baseline'
    );
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});

test('plugin surface matches the recorded baseline', async () => {
  const { createNv8, domPreset } = await import('../src/index.js');
  const { streamsPlugin } = await import('../src/plugins/streams/index.js');
  const { fetchPlugin } = await import('../src/plugins/fetch/index.js');
  const { storagePlugin } = await import('../src/plugins/storage/index.js');

  const nv8 = await createNv8({
    plugins: [...domPreset, streamsPlugin, fetchPlugin, storagePlugin],
    profile: {
      id: 'baseline-full-surface',
      version: '1.0.0',
      name: 'Baseline',
      url: 'https://baseline.test/',
    },
    logger: silentLogger,
  });

  try {
    const realm = await nv8.sandbox.createRealm({
      type: 'root',
      pageUrl: 'https://baseline.test/',
    });
    const actual = summarizeFullSurface(
      await captureFullSurface((source) => realm.evaluate(source))
    );
    const recorded = fixture.tiers[surfaceTier()].plugin;
    const diff = diffFullSurface(recorded, actual);

    const unexplained = diff.missing.filter(
      (name) => expectedMissingForNode(name) === null
    );

    assert.deepEqual(unexplained, [], 'globals disappeared without a registered reason');
    assert.deepEqual(diff.added, [], 'new globals appeared; update the fixture deliberately');
    assert.deepEqual(
      diff.changed.map((entry) => entry.name),
      [],
      'global descriptors changed; explain or re-record the baseline'
    );
  } finally {
    await nv8.destroy();
  }
});

test('surface capture is deterministic across repeated runs', async () => {
  const { createNv8, domPreset } = await import('../src/index.js');
  const nv8 = await createNv8({
    plugins: domPreset,
    profile: {
      id: 'baseline-determinism',
      version: '1.0.0',
      name: 'Baseline',
      url: 'https://baseline.test/',
    },
    logger: silentLogger,
  });

  try {
    const realm = await nv8.sandbox.createRealm({
      type: 'root',
      pageUrl: 'https://baseline.test/',
    });
    const evaluate = (source) => realm.evaluate(source);
    const first = summarizeFullSurface(await captureFullSurface(evaluate));
    const second = summarizeFullSurface(await captureFullSurface(evaluate));
    assert.equal(first.digest, second.digest, 'capture must not depend on call order');
  } finally {
    await nv8.destroy();
  }
});

test('diffFullSurface reports missing, added and changed separately', () => {
  const base = {
    groups: {
      Kept: 'function:2:0:aaaaaaaaaaaaaaaa',
      Gone: 'function:1:0:bbbbbbbbbbbbbbbb',
      Altered: 'function:3:0:cccccccccccccccc',
    },
  };
  const next = {
    groups: {
      Kept: 'function:2:0:aaaaaaaaaaaaaaaa',
      Altered: 'function:4:0:dddddddddddddddd',
      Fresh: 'object:0:0:eeeeeeeeeeeeeeee',
    },
  };

  const diff = diffFullSurface(base, next);
  assert.deepEqual(diff.missing, ['Gone']);
  assert.deepEqual(diff.added, ['Fresh']);
  assert.equal(diff.changed.length, 1);
  assert.equal(diff.changed[0].name, 'Altered');
  assert.deepEqual(diff.changed[0].memberCount, [3, 4]);
});

test('group encoding stays compact and parseable', () => {
  const recorded = fixture.tiers[surfaceTier()].plugin;
  const sample = Object.entries(recorded.groups)[0];
  assert.ok(sample, 'fixture must record groups');
  const [, encoded] = sample;
  assert.equal(typeof encoded, 'string', 'groups are stored as compact strings');
  const parts = encoded.split(':');
  assert.equal(parts.length, 4, 'encoding is valueType:members:symbols:digest16');
  assert.match(parts[3], /^[a-f0-9]{16}$/, 'digest is truncated to 16 hex chars');
});
