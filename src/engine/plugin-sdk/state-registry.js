/**
 * Plugin SDK - State Registry
 *
 * 四层作用域：plugin / sandbox / realm / app。实现统一委托给 Core 的
 * `engine/core/state-registry.js`：配额（maxContexts / maxKeysPerStore /
 * maxTotalKeys）、按 sandboxId 的桶隔离、销毁与清空的原子语义只有一份实现，
 * 避免 SDK 与 Core 两套注册表在配额和清理行为上漂移（F-E4）。
 */

import { createStateRegistry as createCoreStateRegistry } from '../core/state-registry.js';

/**
 * 创建状态注册表（与 Core 同一实现与配额契约）。
 *
 * @param {object} [options]
 * @param {number} [options.maxContexts]
 * @param {number} [options.maxKeysPerStore]
 * @param {number} [options.maxTotalKeys]
 */
export function createStateRegistry(options) {
  return createCoreStateRegistry(options);
}

/**
 * 创建状态访问器（绑定到特定插件实例/Realm/Sandbox 上下文）。
 */
export function createStateAccessor(registry, pluginInstanceId, realmId, sandboxId) {
  return {
    /** 获取插件私有状态 */
    get(key) {
      return registry.get(key, 'plugin', pluginInstanceId);
    },

    /** 设置插件私有状态 */
    set(key, value) {
      registry.set(key, value, 'plugin', pluginInstanceId);
    },

    /** 删除插件私有状态 */
    delete(key) {
      return registry.delete(key, 'plugin', pluginInstanceId);
    },

    /** 检查插件私有状态 */
    has(key) {
      return registry.has(key, 'plugin', pluginInstanceId);
    },

    /** 获取其他作用域的状态 */
    getScoped(key, scope) {
      const contextId = getContextId(scope);
      return registry.get(key, scope, contextId);
    },

    /** 设置其他作用域的状态 */
    setScoped(key, value, scope) {
      const contextId = getContextId(scope);
      registry.set(key, value, scope, contextId);
    },

    /** 删除其他作用域的状态 */
    deleteScoped(key, scope) {
      const contextId = getContextId(scope);
      return registry.delete(key, scope, contextId);
    },

    /** 检查其他作用域的状态 */
    hasScoped(key, scope) {
      const contextId = getContextId(scope);
      return registry.has(key, scope, contextId);
    },

    /** 清空插件私有状态 */
    clear() {
      registry.clear('plugin', pluginInstanceId);
    },

    /** 获取快照（调试） */
    snapshot(scope = 'plugin') {
      const contextId = getContextId(scope);
      return registry.snapshot(scope, contextId);
    },
  };

  function getContextId(scope) {
    if (scope === 'plugin') return pluginInstanceId;
    if (scope === 'realm') return realmId;
    if (scope === 'sandbox') return sandboxId;
    if (scope === 'app') return null;
    throw new Error(`Invalid scope: ${scope}`);
  }
}

/**
 * 兼容旧 API 的 getState 函数
 *
 * 历史调用方（surface 的 window event handler）把 Realm 全局对象直接当
 * contextId 传入。Core 注册表的 contextId 契约是字符串，因此这里对对象
 * contextId 做稳定映射：WeakMap 跟随模块实例，而模块实例本身按 Realm
 * 隔离，不会跨 Realm 串扰，也不会阻止对象被回收。
 *
 * @param {string} key - 状态键
 * @param {'plugin'|'sandbox'|'realm'|'app'} scope - 作用域
 * @param {any} contextId - 上下文 ID（字符串或宿主对象）
 * @param {Function} [init] - 初始化函数，如果状态不存在则调用
 * @returns {any} 状态值
 */
export function getState(key, scope, contextId, init) {
  // 获取全局状态注册表（假设在某处已创建）
  if (!globalThis.__nv8StateRegistry) {
    globalThis.__nv8StateRegistry = createStateRegistry();
  }

  const registry = globalThis.__nv8StateRegistry;
  const normalizedId = normalizeContextId(scope, contextId);

  if (!registry.has(key, scope, normalizedId) && typeof init === 'function') {
    const value = init();
    registry.set(key, value, scope, normalizedId);
    return value;
  }

  return registry.get(key, scope, normalizedId);
}

const objectContextIds = new WeakMap();
let nextObjectContextId = 1;

function normalizeContextId(scope, contextId) {
  if (scope === 'app') return null;
  if (typeof contextId === 'string' && contextId.length > 0) return contextId;
  if (contextId !== null && typeof contextId === 'object') {
    let id = objectContextIds.get(contextId);
    if (id === undefined) {
      id = `object:${nextObjectContextId}`;
      nextObjectContextId += 1;
      objectContextIds.set(contextId, id);
    }
    return id;
  }
  throw new TypeError(`${scope} state requires a non-empty context id`);
}

/**
 * 状态作用域辅助函数
 */
export const StateScope = {
  PLUGIN: 'plugin',   // 插件私有
  REALM: 'realm',     // Realm 共享
  SANDBOX: 'sandbox', // Sandbox 共享
  APP: 'app',         // 应用全局
};
