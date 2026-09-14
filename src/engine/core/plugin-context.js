/**
 * 插件钩子上下文构造（IKF39V(b)）。
 *
 * 原先 `core/sandbox.js`（install/uninstall）与 `core/realm-factory.js`
 * （activate/reset/dispose）各有一份 `createPluginContext`：字段语义一致、
 * 实现重复，修改时极易只改一边造成漂移。这里把两个变体收敛到同一模块。
 *
 * 两个变体的差异是结构性的，不是重复：
 * - sandbox 级（install/uninstall）：没有 Realm 绑定，只有 `realm: null`、
 *   `surfaceRegistry`，`exports` 由 SDK 创建后回填到 `plugin._exports`。
 * - realm 级（activate/reset/dispose）：有 `global` / `realm` 包装对象、
 *   `moduleLoader` / `pageUrl` / `pageHtml` / `runtime`，`exports` 直接
 *   接续 install 阶段写入的 `plugin._exports`。
 */

import { createStateAccessor } from '../plugin-sdk/state-registry.js';

function pluginState(plugin, stateRegistry, realmId, sandboxId) {
  return createStateAccessor(
    stateRegistry,
    `${plugin.id}@${plugin.version}#${sandboxId}`,
    realmId,
    sandboxId,
  );
}

function pluginLoggers(plugin, logger, trace, realmId) {
  const label = realmId === null
    ? `[Plugin ${plugin.id}]`
    : `[Plugin ${plugin.id}@${realmId}]`;
  return {
    trace(...args) {
      if (trace) {
        logger.info(label, ...args);
      }
    },
    warn(...args) {
      logger.warn(label, ...args);
    },
    error(...args) {
      logger.error(label, ...args);
    },
  };
}

/**
 * 创建 sandbox 级插件上下文（`install` / `uninstall` 钩子）。
 *
 * @param {object} options
 * @param {object} options.plugin 插件定义
 * @param {string} options.sandboxId
 * @param {object|null} [options.realm] Realm 描述；sandbox 级安装为 null
 * @param {object} options.stateRegistry
 * @param {object} options.globals 共享注册表（nativeFunctionRegistry 等）
 * @param {object} options.surfaceRegistry
 * @param {object} options.logger
 * @param {boolean} options.trace
 */
export function createSandboxPluginContext({
  plugin,
  sandboxId,
  realm = null,
  stateRegistry,
  globals,
  surfaceRegistry,
  logger,
  trace,
}) {
  return {
    // 插件信息
    plugin: {
      id: plugin.id,
      version: plugin.version,
      provides: plugin.provides,
      requires: plugin.requires,
    },

    // Realm 引用（可能为 null）
    realm: realm || null,
    sandboxId,
    surfaceRegistry,

    // 状态管理
    state: pluginState(plugin, stateRegistry, realm?.id || null, sandboxId),

    // 全局配置和注册表
    globals,

    // 导出对象（由插件填充）
    exports: {},

    ...pluginLoggers(plugin, logger, trace, null),
  };
}

/**
 * 创建 realm 级插件上下文（`activate` / `reset` / `dispose` 钩子）。
 *
 * @param {object} options
 * @param {object} options.plugin 插件定义
 * @param {object} options.vmContext Realm 的 vm context（`globalThis`）
 * @param {string} options.sandboxId
 * @param {string} options.realmId
 * @param {object} options.stateRegistry
 * @param {object} options.globals 共享注册表（nativeFunctionRegistry 等）
 * @param {object} options.logger
 * @param {boolean} options.trace
 * @param {string} [options.realmType]
 * @param {object|null} [options.moduleLoader]
 * @param {string} [options.pageUrl]
 * @param {string} [options.pageHtml]
 * @param {object} [options.runtime]
 */
export function createRealmPluginContext({
  plugin,
  vmContext,
  sandboxId,
  realmId,
  stateRegistry,
  globals,
  logger,
  trace,
  realmType = 'root',
  moduleLoader = null,
  pageUrl = 'https://example.com/',
  pageHtml = '',
  runtime = {},
}) {
  return {
    // 插件信息
    plugin: {
      id: plugin.id,
      version: plugin.version,
      provides: plugin.manifest?.provides || plugin.provides || [],
      requires: plugin.manifest?.requires || plugin.requires || [],
    },

    // Realm 全局对象
    global: vmContext,
    realm: {
      id: realmId,
      type: realmType,
      global: vmContext,
    },
    sandboxId,
    moduleLoader,
    pageUrl,
    pageHtml,
    runtime,

    // 状态管理（IKF39V(b)/(d)）：与 sandbox 侧 install 上下文共用同一套
    // createStateAccessor / 同一 pluginInstanceId，install 写入的状态在
    // activate 里能读到；realm 作用域经 getScoped('realm') 访问。
    state: pluginState(plugin, stateRegistry, realmId, sandboxId),

    // 全局配置和注册表
    globals,

    // 导出对象（从 install 阶段获取）
    exports: plugin._exports || {},

    ...pluginLoggers(plugin, logger, trace, realmId),
  };
}
