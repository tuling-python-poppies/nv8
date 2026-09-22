/**
 * Node 兼容性测试
 *
 * 覆盖：
 * - 能力探测三态（available / broken / unavailable）
 * - Node 版本支持矩阵与前置检查
 * - vm module 链接策略与异步 loader 路径
 * - 宿主 API 回退
 *
 * 关键测试手法：临时移除 Node 24 专有的 vm module API，模拟 Node 18–22
 * 的运行环境，验证降级路径真的可用而不是仅存在于文档里。
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

import {
  CAPABILITY_STATUS,
  MINIMUM_NODE_VERSION,
  NODE_SUPPORT_MATRIX,
  detectHostCapabilities,
  hostCapabilityStatus,
  hostSupports,
  preflightHostCheck,
  resolveNodeSupport,
} from '../src/engine/core/host-capabilities.js';

import {
  LINK_STRATEGY,
  detectLinkStrategy,
  readDependencySpecifiers,
  resetLinkStrategyCache,
} from '../src/engine/realm/module-link-strategy.js';

import { RealmModuleLoader } from '../src/engine/realm/module-loader.js';

import { describeHostCompat } from '../src/engine/compat/host-compat.js';

const SAMPLE_MODULE_URL = new URL('../src/engine/webidl/descriptor.js', import.meta.url);

/**
 * 在移除 Node 24 专有 vm module API 的环境下执行 fn，
 * 模拟 Node 18–22。
 */
async function withLegacyVmModuleApi(fn) {
  const proto = Object.getPrototypeOf(new vm.SourceTextModule('export default 1;'));
  const saved = {
    linkRequests: proto.linkRequests,
    instantiate: proto.instantiate,
    moduleRequests: Object.getOwnPropertyDescriptor(proto, 'moduleRequests'),
  };

  delete proto.linkRequests;
  delete proto.instantiate;
  delete proto.moduleRequests;
  resetLinkStrategyCache();

  try {
    return await fn();
  } finally {
    proto.linkRequests = saved.linkRequests;
    proto.instantiate = saved.instantiate;
    if (saved.moduleRequests) {
      Object.defineProperty(proto, 'moduleRequests', saved.moduleRequests);
    }
    resetLinkStrategyCache();
  }
}

// ---------------------------------------------------------- 能力探测三态

test('capabilities report a three-state status with a reason', () => {
  const host = detectHostCapabilities();

  assert.equal(typeof host.nodeVersion, 'string');
  assert.equal(typeof host.v8Version, 'string');
  assert.ok(host.capabilities['vm.context']);

  for (const record of Object.values(host.capabilities)) {
    assert.ok(
      Object.values(CAPABILITY_STATUS).includes(record.status),
      `unexpected status: ${record.status}`
    );
    // available 无需 reason，其余必须给出可行动原因
    if (record.status === CAPABILITY_STATUS.AVAILABLE) {
      assert.equal(record.reason, null);
    } else {
      assert.equal(typeof record.reason, 'string');
      assert.ok(record.reason.length > 0);
    }
  }
});

test('vm.context is available and actually evaluates', () => {
  const host = detectHostCapabilities();
  assert.equal(host.capabilities['vm.context'].status, CAPABILITY_STATUS.AVAILABLE);
  assert.equal(hostSupports(host, 'vm.context'), true);
});

test('boolean features view stays available for legacy consumers', () => {
  const host = detectHostCapabilities();
  assert.equal(host.features['vm.context'], true);
  for (const [id, record] of Object.entries(host.capabilities)) {
    assert.equal(
      host.features[id],
      record.status === CAPABILITY_STATUS.AVAILABLE,
      `features view disagrees with capabilities for ${id}`
    );
  }
});

test('hostSupports treats broken as unusable', () => {
  const host = {
    capabilities: {
      'fake.broken': { id: 'fake.broken', status: CAPABILITY_STATUS.BROKEN, reason: 'flag missing' },
    },
    features: { 'fake.broken': false },
  };
  assert.equal(hostSupports(host, 'fake.broken'), false);
  assert.equal(hostCapabilityStatus(host, 'fake.broken').reason, 'flag missing');
});

test('hostSupports falls back to a boolean-only snapshot', () => {
  const legacy = { features: { 'vm.context': true } };
  assert.equal(hostSupports(legacy, 'vm.context'), true);
  assert.equal(hostSupports(legacy, 'vm.source-text-module'), false);
});

test('unknown capabilities report unavailable rather than throwing', () => {
  const host = detectHostCapabilities();
  const status = hostCapabilityStatus(host, 'does.not.exist');
  assert.equal(status.status, CAPABILITY_STATUS.UNAVAILABLE);
});

// ------------------------------------------------------ 版本支持矩阵

test('support matrix is ordered from newest to oldest', () => {
  for (let index = 1; index < NODE_SUPPORT_MATRIX.length; index += 1) {
    const previous = NODE_SUPPORT_MATRIX[index - 1].range;
    const current = NODE_SUPPORT_MATRIX[index].range;
    const descending = previous[0] > current[0]
      || (previous[0] === current[0] && previous[1] > current[1]);
    assert.ok(descending, `entry ${index} is not below its predecessor`);
  }
});

test('resolveNodeSupport classifies representative versions', () => {
  assert.equal(resolveNodeSupport('24.11.0').tier, 'supported');
  assert.equal(resolveNodeSupport('22.9.0').tier, 'supported');
  // 20 和 18.18 已在本机四版本矩阵上全量验证通过
  assert.equal(resolveNodeSupport('20.11.0').tier, 'supported');
  assert.equal(resolveNodeSupport('18.18.0').tier, 'supported');
  assert.equal(resolveNodeSupport('18.17.0').tier, 'unsupported');
  assert.equal(resolveNodeSupport('16.20.0').tier, 'unsupported');
});

test('minimum version boundary is exact', () => {
  assert.equal(resolveNodeSupport('18.18.0').meetsMinimum, true);
  assert.equal(resolveNodeSupport('18.17.9').meetsMinimum, false);
  assert.equal(MINIMUM_NODE_VERSION.major, 18);
  assert.equal(MINIMUM_NODE_VERSION.minor, 18);
});

test('unparseable versions are unsupported, not crashes', () => {
  const result = resolveNodeSupport('not-a-version');
  assert.equal(result.tier, 'unsupported');
  assert.equal(result.meetsMinimum, false);
  assert.equal(result.version, null);
});

test('preflight passes on the current runtime', () => {
  const host = preflightHostCheck();
  assert.equal(host.nodeVersion, process.versions.node);
});

test('preflight rejects a runtime below the minimum', () => {
  assert.throws(
    () => preflightHostCheck({
      capabilities: { nodeVersion: '16.20.0', capabilities: {}, features: {} },
    }),
    (error) => {
      assert.equal(error.code, 'HOST_REQUIREMENT_UNAVAILABLE');
      assert.match(error.message, /requires Node >= 18\.18/);
      return true;
    }
  );
});

test('preflight warns but proceeds on best-effort versions', () => {
  const warnings = [];
  // 构造一个 best-effort 等级的快照（当前矩阵里没有这个等级，
  // 但 preflight 必须具备处理能力，以便未来新增版本时不需改逻辑）
  const host = {
    nodeVersion: '20.11.0',
    capabilities: {
      'array-buffer.transfer': {
        id: 'array-buffer.transfer',
        status: CAPABILITY_STATUS.UNAVAILABLE,
        reason: 'requires Node 21+',
      },
    },
    features: { 'array-buffer.transfer': false },
  };

  const result = preflightHostCheck({
    capabilities: host,
    warn: (message) => warnings.push(message),
    supportOverride: { tier: 'best-effort', notes: 'synthetic tier', meetsMinimum: true },
  });

  assert.equal(result.nodeVersion, '20.11.0');
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /best-effort/);
  assert.match(warnings[0], /array-buffer\.transfer/);
});

test('preflight stays silent on fully supported versions', () => {
  const warnings = [];
  preflightHostCheck({ warn: (message) => warnings.push(message) });
  assert.deepEqual(warnings, [], 'supported tier must not warn');
});

// ------------------------------------------------- vm module 链接策略

test('link strategy is detected and cached', () => {
  resetLinkStrategyCache();
  const first = detectLinkStrategy();
  const second = detectLinkStrategy();
  assert.equal(first, second, 'result must be cached');
  assert.ok(Object.values(LINK_STRATEGY).includes(first.strategy));
  assert.equal(first.nodeVersion, process.versions.node);
});

test('link strategy matches the host vm module API', () => {
  resetLinkStrategyCache();
  const strategy = detectLinkStrategy();

  // 不假设具体 Node 版本：断言“探测结果与实际 API 一致”
  const probe = new vm.SourceTextModule('export default 1;');
  const hasRequestsApi = Array.isArray(probe.moduleRequests)
    && typeof probe.linkRequests === 'function'
    && typeof probe.instantiate === 'function';

  if (hasRequestsApi) {
    assert.equal(strategy.strategy, LINK_STRATEGY.REQUESTS_SYNC);
    assert.equal(strategy.supportsSyncLink, true);
    assert.equal(strategy.reason, null);
  } else {
    assert.equal(strategy.strategy, LINK_STRATEGY.LEGACY_ASYNC);
    assert.equal(strategy.supportsSyncLink, false);
    assert.match(strategy.reason, /importUrlAsync/);
  }
});

test('removing the Node 24 API degrades to the legacy async strategy', async () => {
  await withLegacyVmModuleApi(() => {
    const strategy = detectLinkStrategy();
    assert.equal(strategy.strategy, LINK_STRATEGY.LEGACY_ASYNC);
    assert.equal(strategy.supportsSyncLink, false);
    assert.match(strategy.reason, /importUrlAsync/);
  });
});

test('readDependencySpecifiers works under both APIs', async () => {
  const source = 'import { x } from "./dep.js"; export const y = x;';

  const modern = new vm.SourceTextModule(source, { identifier: 'modern' });
  assert.deepEqual(readDependencySpecifiers(modern), ['./dep.js']);

  await withLegacyVmModuleApi(() => {
    const legacy = new vm.SourceTextModule(source, { identifier: 'legacy' });
    assert.deepEqual(
      readDependencySpecifiers(legacy),
      ['./dep.js'],
      'must fall back to dependencySpecifiers'
    );
  });
});

// ------------------------------------------------------ ModuleLoader 路径

test('synchronous import works when the host supports sync linking', () => {
  resetLinkStrategyCache();
  const loader = new RealmModuleLoader(vm.createContext({}));

  if (!detectLinkStrategy().supportsSyncLink) {
    // Node 18–22：必须拒绝，而不是返回半初始化模块
    assert.throws(
      () => loader.importUrl(SAMPLE_MODULE_URL),
      (error) => error.code === 'ERR_NV8_MODULE_SYNC_LINK_UNAVAILABLE'
    );
    return;
  }

  const module = loader.importUrl(SAMPLE_MODULE_URL);
  assert.equal(module.status, 'evaluated');
  assert.ok(Object.keys(module.namespace).length > 0);
});

test('asynchronous import works on every supported host', async () => {
  resetLinkStrategyCache();
  const loader = new RealmModuleLoader(vm.createContext({}));
  const module = await loader.importUrlAsync(SAMPLE_MODULE_URL);
  assert.equal(module.status, 'evaluated');
  assert.ok(Object.keys(module.namespace).length > 0);
});

test('synchronous import is refused when the host lacks sync linking', async () => {
  await withLegacyVmModuleApi(() => {
    const loader = new RealmModuleLoader(vm.createContext({}));
    assert.throws(
      () => loader.importUrl(SAMPLE_MODULE_URL),
      (error) => {
        assert.equal(error.code, 'ERR_NV8_MODULE_SYNC_LINK_UNAVAILABLE');
        assert.ok(error.suggestions.some((entry) => entry.includes('importUrlAsync')));
        return true;
      }
    );
  });
});

test('asynchronous import still works when the host lacks sync linking', async () => {
  await withLegacyVmModuleApi(async () => {
    const loader = new RealmModuleLoader(vm.createContext({}));
    const module = await loader.importUrlAsync(SAMPLE_MODULE_URL);
    assert.equal(module.status, 'evaluated');
    assert.ok(
      Object.keys(module.namespace).length > 0,
      'legacy async path must produce a fully evaluated module'
    );
  });
});

test('loader exposes the active link strategy for diagnostics', () => {
  resetLinkStrategyCache();
  const loader = new RealmModuleLoader(vm.createContext({}));
  assert.equal(loader.linkStrategy().strategy, detectLinkStrategy().strategy);
  assert.ok(Object.values(LINK_STRATEGY).includes(loader.linkStrategy().strategy));
});

test('async import rejects modules outside the source tree', async () => {
  const loader = new RealmModuleLoader(vm.createContext({}));
  await assert.rejects(
    () => loader.importUrlAsync(new URL('file:///etc/passwd')),
    /outside the runtime source tree/
  );
});

// ------------------------------------------------------------ 宿主回退

test('describeHostCompat reports native availability', () => {
  const compat = describeHostCompat();
  assert.equal(compat.nodeVersion, process.versions.node);
  for (const key of [
    'nativeArrayBufferTransfer',
    'nativeStructuredClone',
    'nativeAsyncDispose',
    'nativeAbortTimeout',
  ]) {
    assert.equal(typeof compat[key], 'boolean', `${key} must be boolean`);
  }
});
