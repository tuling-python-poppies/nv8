/**
 * Nv8 主入口
 * 
 * 提供简化的 API 用于创建和管理沙箱
 */

import { Buffer } from 'node:buffer';
import { createSandbox } from './engine/core/sandbox.js';
import { createPluginRegistry } from './engine/core/plugin-registry.js';
import { createStateRegistry } from './engine/core/state-registry.js';
import { createLogger } from './infra/utils/logger.js';
import { defaultPreset } from './config/presets/index.js';
import { loadEvidenceBundle } from './collection/evidence/loader.js';
import { createEvidenceSource } from './collection/evidence/evidence-source.js';
import { normalizeTrustedScriptPolicy } from './engine/core/evidence-contract.js';
import { detectHostCapabilities } from './engine/core/host-capabilities.js';
import { resolveProfileCapabilities } from './config/profiles/capability-policy.js';
import { validateLegacyFullPolicy } from './config/profiles/legacy-full-policy.js';
import {
  assertPluginLockPlan,
  createPluginLockPlan,
} from './engine/core/plugin-lock-plan.js';
import { createProfile } from './config/profiles/index.js';
import * as allPlugins from './plugins/index.js';

/**
 * 创建 Nv8 实例
 * 
 * @param {Nv8Options} options - 配置选项
 * @returns {Promise<Nv8Instance>}
 */
export async function createNv8(options = {}) {
  if (!['legacy', 'plugin'].includes(options.runtimeMode ?? 'legacy')) {
    throw new TypeError('runtimeMode must be legacy or plugin');
  }
  const {
    appId = 'default-app',
    plugins: configuredPlugins = null,
    profile: profileInput = {},
    profileId = null,
    evidence: evidenceOption = null,
    trace = false,
    logger = createLogger(),
    runtime = {},
    runtimeMode = 'legacy',
    pluginLockPlan = null,
    limits = {},
    capabilityPolicy = 'degrade',
    scriptPolicy = undefined,
  } = options;
  const hasProfileInput = profileId !== null
    || typeof profileInput === 'string'
    || (profileInput !== null && typeof profileInput === 'object'
      && Object.keys(profileInput).length > 0);
  const selectedProfile = hasProfileInput
    ? createProfile(profileId || profileInput)
    : { id: 'default' };
  
  // Resolve plugin references to actual plugin objects
  let plugins = configuredPlugins || selectedProfile.plugins || defaultPreset;
  if (selectedProfile.plugins && !configuredPlugins) {
    // Profile contains plugin references {id, range}, need to resolve to actual plugins
    const pluginMap = new Map();
    for (const [exportName, plugin] of Object.entries(allPlugins)) {
      if (plugin && typeof plugin === 'object' && plugin.id) {
        pluginMap.set(plugin.id, plugin);
      }
    }
    plugins = selectedProfile.plugins.map(ref => {
      const plugin = pluginMap.get(ref.id || ref);
      if (!plugin) {
        throw new Error(`Plugin not found: ${ref.id || ref}`);
      }
      return plugin;
    });
  }
  const profile = selectedProfile;
  const evidence = normalizeCoreEvidence(evidenceOption);
  // 具体 Bundle 立即包装为抽象 EvidenceSource，往下只传递契约对象
  const evidenceSource = evidence === null
    ? null
    : createEvidenceSource(await loadEvidenceBundle(evidence.bundlePath, {
      trustedScriptPolicy: evidence.trustedScriptPolicy,
      signaturePolicy: evidence.signaturePolicy,
      trustedKeys: evidence.trustedKeys ?? undefined,
    }));
  const configuredReplay = normalizeCoreReplay(options.replay);
  // 显式 options.replay 永远优先；useNetworkReplay:false 只禁用**证据 Bundle**
  // 的自动回放装载，不会覆盖调用方显式传入的 replay 记录。
  const replay = configuredReplay.length > 0
    || evidenceSource === null
    || evidence.useNetworkReplay === false
    ? configuredReplay
    : await loadCoreReplay(evidenceSource);
  const effectiveProfile = {
    id: profile.id || 'default',
    ...profile,
    ...(typeof profileInput === 'object' ? profileInput : {}),
  };
  if (evidenceSource !== null && evidence.usePage) {
    const [page] = await evidenceSource.listPages();
    if (page) effectiveProfile.pageHtml = await evidenceSource.readText(page.id);
  }
  if (effectiveProfile.id === 'legacy-full') {
    validateLegacyFullPolicy(effectiveProfile);
  }
  
  // 创建插件注册表
  const pluginRegistry = createPluginRegistry();
  
  // 注册所有插件
  for (const plugin of plugins) {
    pluginRegistry.register(plugin);
  }
  
  // 解析插件依赖
  const resolvedPlugins = pluginRegistry.resolve();
  const hostCapabilities = detectHostCapabilities();
  const capabilityResolution = resolveProfileCapabilities(
    effectiveProfile,
    hostCapabilities,
    { policy: capabilityPolicy },
  );
  const lockPlan = createPluginLockPlan({
    plugins: resolvedPlugins,
    profile: effectiveProfile,
    hostCapabilities,
    runtimeMode,
  });
  assertPluginLockPlan(lockPlan, pluginLockPlan);
  
  logger.info(`[Nv8] Creating instance with ${resolvedPlugins.length} plugins`);
  
  const normalizedLimits = normalizeCoreLimits(limits);

  // 创建状态注册表；容量属于 Sandbox 实例而不是宿主全局配置
  const stateRegistry = createStateRegistry({
    maxContexts: normalizedLimits.maxStateContexts,
    maxKeysPerStore: normalizedLimits.maxStateKeysPerStore,
    maxTotalKeys: normalizedLimits.maxStateTotalKeys,
  });
  
  // 创建沙箱
  const sandbox = await createSandbox({
    appId,
    profile: effectiveProfile,
    limits: normalizedLimits,
    plugins: resolvedPlugins,
    stateRegistry,
    trace,
    logger,
    replay,
    evidence,
    evidenceSource,
    runtime: {
      ...runtime,
      scriptPolicy: scriptPolicy ?? effectiveProfile.scriptPolicy ?? runtime.scriptPolicy,
    },
  });
  
  logger.info(`[Nv8] Instance created: ${sandbox.id}`);
  
  return {
    sandbox,
    lockPlan,
    hostCapabilities,
    capabilityResolution,
    runtimeMode,
    
    /**
     * 创建 Realm 并返回全局对象
     * 
     * @param {RealmOptions} options
     * @returns {Promise<any>}
     */
    async createRealm(options = {}) {
      const realm = await sandbox.createRealm(options);
      return realm.global;
    },
    
    /**
     * 快速执行代码
     * 
     * @param {string} code - 要执行的代码
     * @param {RealmOptions} options - Realm 配置
     * @returns {Promise<any>}
     */
    async eval(code, options = {}) {
      const realm = await sandbox.createRealm(options);
      let timer;
      try {
        // vm 的 timeout 约束同步执行；宿主 deadline 约束 Promise 等待。
        // 必须在 try 内 await，否则 finally 会先销毁仍需定时器的 Realm。
        const deadline = new Promise((_, reject) => {
          timer = setTimeout(() => {
            const error = new Error(`Script execution timed out after ${normalizedLimits.timeoutMs}ms`);
            error.code = 'ERR_SCRIPT_EXECUTION_TIMEOUT';
            error.timeoutMs = normalizedLimits.timeoutMs;
            reject(error);
          }, normalizedLimits.timeoutMs);
        });
        return await Promise.race([realm.evaluate(code), deadline]);
      } finally {
        clearTimeout(timer);
        // reset/destroy 可能已移除了登记，不能用 not-found 掩盖执行结果。
        if (sandbox.getRealm(realm.id) === realm) {
          await sandbox.destroyRealm(realm.id);
        } else {
          await realm.destroy();
        }
      }
    },
    
    /**
     * 销毁实例
     */
    async destroy() {
      await sandbox.destroy();
    },
    
    /**
     * 调试信息
     */
    inspect() {
      return sandbox.inspect();
    },
  };
}

function normalizeCoreLimits(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('limits must be an object');
  }
  const integer = (value, fallback, name, minimum) => {
    const selected = value ?? fallback;
    if (!Number.isSafeInteger(selected) || selected < minimum) {
      throw new RangeError(`${name} must be an integer >= ${minimum}`);
    }
    return selected;
  };
  return Object.freeze({
    timeoutMs: integer(input.timeoutMs, 5_000, 'limits.timeoutMs', 1),
    maxRealms: integer(input.maxRealms, 64, 'limits.maxRealms', 1),
    maxWorkerRealms: integer(
      input.maxWorkerRealms,
      4096,
      'limits.maxWorkerRealms',
      0,
    ),
    maxWorkerConnections: integer(
      input.maxWorkerConnections,
      4096,
      'limits.maxWorkerConnections',
      0,
    ),
    maxWorkerDepth: integer(
      input.maxWorkerDepth,
      64,
      'limits.maxWorkerDepth',
      0,
    ),
    maxLifecycleEntries: integer(
      input.maxLifecycleEntries,
      10_000,
      'limits.maxLifecycleEntries',
      1,
    ),
    maxStateContexts: integer(
      input.maxStateContexts,
      256,
      'limits.maxStateContexts',
      1,
    ),
    maxStateKeysPerStore: integer(
      input.maxStateKeysPerStore,
      4_096,
      'limits.maxStateKeysPerStore',
      1,
    ),
    maxStateTotalKeys: integer(
      input.maxStateTotalKeys,
      65_536,
      'limits.maxStateTotalKeys',
      1,
    ),
  });
}

function normalizeCoreReplay(input) {
  if (input === undefined || input === null) return [];
  if (!Array.isArray(input)) throw new TypeError('replay must be an array');
  return input.map((entry, index) => {
    if (entry === null || typeof entry !== 'object') {
      throw new TypeError(`replay[${index}] must be an object`);
    }
    if (typeof entry.url !== 'string' || entry.url.length === 0) {
      throw new TypeError(`replay[${index}].url must be a non-empty string`);
    }
    return Object.freeze({
      method: `${entry.method ?? 'GET'}`.toUpperCase(),
      url: entry.url,
      status: Number(entry.status ?? 200),
      statusText: `${entry.statusText ?? ''}`,
      headers: Object.freeze({ ...(entry.headers || {}) }),
      requestHeaders: entry.requestHeaders || null,
      requestBody: entry.requestBody ?? null,
      requestBodySha256: entry.requestBodySha256 ?? null,
      repeat: entry.repeat ?? 'once',
      sequence: entry.sequence,
      matching: entry.matching ?? null,
      body: `${entry.body ?? ''}`,
      redirected: Boolean(entry.redirected),
      type: `${entry.type ?? 'basic'}`,
    });
  });
}

async function loadCoreReplay(source) {
  const fixture = await source.getNetworkReplayFixture();
  // 没有 replay fixture 的 Bundle（只含脚本/页面）是合法输入：没有回放
  // 就返回空表。只有「声明了 fixture 但结构不对」才算格式错误。
  if (fixture === null || fixture === undefined) return [];
  if (!Array.isArray(fixture.requests)) {
    throw new TypeError('Evidence replay fixture must contain a requests array');
  }
  const entries = [];
  for (const [index, record] of fixture.requests.entries()) {
    const request = record?.request;
    const response = record?.response;
    if (!request || !response || typeof request.url !== 'string') {
      throw new TypeError(`Invalid Evidence replay request at index ${index}`);
    }
    let body = response.body ?? '';
    if (response.bodyFile !== undefined) {
      body = await source.readText(response.bodyFile);
    } else if (response.bodyBase64 !== undefined) {
      body = Buffer.from(`${response.bodyBase64}`, 'base64').toString('utf8');
    } else if (typeof body !== 'string') {
      body = JSON.stringify(body);
    }
    entries.push({
      method: `${request.method ?? 'GET'}`.toUpperCase(),
      url: request.url,
      status: Number(response.status ?? 200),
      statusText: `${response.statusText ?? ''}`,
      headers: response.headers || {},
      requestHeaders: request.headers || null,
      requestBody: request.body ?? null,
      requestBodySha256: request.bodySha256 ?? null,
      repeat: record.repeat ?? 'once',
      sequence: record.sequence,
      matching: fixture.matching ?? record.matching ?? null,
      body,
      redirected: Boolean(response.redirected),
      type: `${response.type ?? 'basic'}`,
    });
  }
  return normalizeCoreReplay(entries);
}

function normalizeCoreEvidence(input) {
  if (input === undefined || input === null) return null;
  const value = typeof input === 'string' ? { bundlePath: input } : input;
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('evidence must be a path or object');
  }
  if (typeof value.bundlePath !== 'string' || value.bundlePath.length === 0) {
    throw new TypeError('evidence.bundlePath must be a non-empty string');
  }
  // 策略校验复用契约层，包含旧名别名兼容
  const { policy: trustedScriptPolicy } = normalizeTrustedScriptPolicy({
    trustedScriptPolicy: value.trustedScriptPolicy,
    scriptAllowlist: value.scriptAllowlist,
  });
  if (value.scriptAllowlist !== undefined && !Array.isArray(value.scriptAllowlist)) {
    throw new TypeError('evidence.scriptAllowlist must be an array');
  }
  const useNetworkReplay = value.useNetworkReplay ?? true;
  if (typeof useNetworkReplay !== 'boolean') {
    throw new TypeError('evidence.useNetworkReplay must be a boolean');
  }
  // 签名选项必须在高层入口就贯通到 loadEvidenceBundle，否则调用方以为
  // 启用了校验，实际加载器仍按 optional 跳过（F-E1）。
  const signaturePolicy = value.signaturePolicy ?? 'optional';
  if (!['optional', 'required', 'disabled'].includes(signaturePolicy)) {
    throw new TypeError('evidence.signaturePolicy must be optional, required, or disabled');
  }
  const trustedKeys = normalizeCoreTrustedKeys(value.trustedKeys);
  return Object.freeze({
    bundlePath: value.bundlePath,
    trustedScriptPolicy,
    scriptAllowlist: Object.freeze([...(value.scriptAllowlist || [])]),
    usePage: value.usePage ?? true,
    executeScripts: value.executeScripts ?? true,
    // 必须透传给下游（runtime-pool 依据它决定是否装载证据回放）；
    // 与 public 路径 edge-runtime-options 的默认值保持一致
    useNetworkReplay,
    signaturePolicy,
    trustedKeys,
  });
}

/**
 * 校验可信公钥集合。Core 路径在进程内校验，key 可以是 KeyObject、PEM/DER
 * 字符串或可迭代的 [keyId, key] 对（与 loadEvidenceBundle 契约一致）。
 */
function normalizeCoreTrustedKeys(input) {
  if (input === undefined || input === null) return null;
  if (input instanceof Map) {
    for (const [keyId, key] of input) {
      assertTrustedKeyEntry(keyId, key);
    }
    return input;
  }
  if (typeof input === 'object' && typeof input[Symbol.iterator] === 'function') {
    const pairs = [];
    for (const entry of input) {
      if (!Array.isArray(entry) || entry.length < 2) {
        throw new TypeError('evidence.trustedKeys entries must be [keyId, key] pairs');
      }
      assertTrustedKeyEntry(entry[0], entry[1]);
      pairs.push([entry[0], entry[1]]);
    }
    return pairs;
  }
  if (typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('evidence.trustedKeys must be a Map, iterable of pairs, or object');
  }
  for (const [keyId, key] of Object.entries(input)) {
    assertTrustedKeyEntry(keyId, key);
  }
  return input;
}

function assertTrustedKeyEntry(keyId, key) {
  if (typeof keyId !== 'string' || !/^[A-Za-z0-9._:-]{1,128}$/.test(keyId)) {
    throw new TypeError('evidence.trustedKeys keyId must be 1-128 safe identifier characters');
  }
  if (key === null || key === undefined) {
    throw new TypeError(`evidence.trustedKeys["${keyId}"] must be a public key`);
  }
}

/**
 * 快速执行代码（便捷方法）
 * 
 * @param {string} code - 要执行的代码
 * @param {Nv8Options} options - 配置选项
 * @returns {Promise<any>}
 */
export async function nv8Eval(code, options = {}) {
  const instance = await createNv8(options);
  try {
    return await instance.eval(code);
  } finally {
    await instance.destroy();
  }
}

/**
 * 导出预设配置
 */
export {
  minimalPreset,
  basicPreset,
  domPreset,
  networkPreset,
  fullPreset,
  defaultPreset,
} from './config/presets/index.js';
export {
  createProfile,
  generateProfileLockPlan,
  validateLockPlan,
  profiles,
  resolveProfileCapabilities,
  PROFILE_CAPABILITY_POLICIES,
} from './config/profiles/index.js';

/**
 * 导出所有插件（供高级用户自定义）
 */
export * from './plugins/index.js';

/**
 * Protocol 层：把运行时工件转成请求变换。不拥有网络出口。
 */
export * as protocol from './collection/request-protocol/index.js';

/**
 * Collector 层：唯一的真实网络出口，受 allowlist 和凭据策略约束。
 */
export * as collector from './collection/collector/index.js';

/**
 * 公共沙箱入口：消费方可以直接 `import { EdgeSandbox, createSandbox } from 'nv8'`。
 *
 * 此前只有 `src/public/*` 文件与子路径，`exports` 未暴露、根模块也未 re-export，
 * 消费方只能按文件 URL 绕行（并且 `nv8/src/public/...` 会被 exports 拒绝）。
 */
export { EdgeSandbox } from './public/edge-sandbox.js';
export { createSandbox } from './public/create-sandbox.js';

/**
 * 冻结浏览器指纹（Edge 150/151/152），与 `nv8/fingerprint/*` 子路径同源。
 */
export { edge150Fingerprint } from './infra/fingerprint/edge-150.js';
export { edge151Fingerprint } from './infra/fingerprint/edge-151.js';
export { edge152Fingerprint } from './infra/fingerprint/edge-152.js';

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} Nv8Options
 * @property {string} [appId] - App ID
 * @property {Plugin[]} [plugins] - 插件列表（默认使用 defaultPreset）
 * @property {Object} [profile] - Profile 配置
 * @property {boolean} [trace] - 是否启用追踪日志
 * @property {Logger} [logger] - 自定义日志工具
 * 
 * @typedef {Object} RealmOptions
 * @property {'root'|'worker'|'iframe'|'worklet'} [type] - Realm 类型
 * 
 * @typedef {Object} Nv8Instance
 * @property {Sandbox} sandbox - 沙箱实例
 * @property {function(RealmOptions): Promise<any>} createRealm - 创建 Realm
 * @property {function(string, RealmOptions): Promise<any>} eval - 执行代码
 * @property {function(): Promise<void>} destroy - 销毁实例
 * @property {function(): Object} inspect - 调试信息
 */
