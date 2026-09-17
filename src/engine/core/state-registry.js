/**
 * State Registry - 简化版本
 * 
 * 用于管理 Sandbox 和 Realm 级别的状态
 */

/**
 * 创建状态注册表
 * 
 * @returns {StateRegistry}
 */
export function createStateRegistry(options = {}) {
  const limits = normalizeLimits(options);
  // 状态存储结构：
  // app -> { key -> value }              （单例，插件 SDK 的 'app' 作用域）
  // sandbox -> { sandboxId -> { key -> value } }
  // realm -> { realmId -> { key -> value } }
  // plugin -> { pluginInstanceId -> { key -> value } }
  //
  // sandbox 必须按 sandboxId 分桶：createApp 可以让多个 Sandbox 共用一个
  // registry，销毁其中一个时清空整张单例表会串扰其他 Sandbox 的状态（F-E4）。
  // 四个作用域统一走 contextStore，配额与原子性语义保持一致。
  const appState = new Map();
  const sandboxStates = new Map();
  const realmStates = new Map();
  const pluginStates = new Map();

  function contextStore(map, contextId, scope, create = false) {
    if (typeof contextId !== 'string' || contextId.length === 0) {
      throw new TypeError(`${scope} state requires a non-empty context id`);
    }
    let store = map.get(contextId);
    if (store === undefined && create) {
      if (map.size >= limits.maxContexts) {
        const error = new RangeError(
          `${scope} state exceeded maxContexts (${limits.maxContexts})`
        );
        error.code = 'ERR_NV8_STATE_CONTEXT_LIMIT';
        error.scope = scope;
        error.limit = limits.maxContexts;
        throw error;
      }
      store = new Map();
      map.set(contextId, store);
    }
    return store;
  }

  function assertKeyCapacity(store, key, scope) {
    if (store.has(key)) return;
    if (store.size >= limits.maxKeysPerStore || totalKeyCount() >= limits.maxTotalKeys) {
      const error = new RangeError(
        `${scope} state exceeded its configured key capacity`
      );
      error.code = 'ERR_NV8_STATE_KEY_LIMIT';
      error.scope = scope;
      error.limit = Math.min(limits.maxKeysPerStore, limits.maxTotalKeys);
      error.actual = store.size + 1;
      throw error;
    }
  }

  function totalKeyCount() {
    let count = appState.size;
    for (const store of sandboxStates.values()) count += store.size;
    for (const store of realmStates.values()) count += store.size;
    for (const store of pluginStates.values()) count += store.size;
    return count;
  }

  /** 带原子配额检查地写入一个 context 桶；失败时不留下空桶。 */
  function setInContext(map, contextId, scope, key, value) {
    const existed = map.has(contextId);
    const store = contextStore(map, contextId, scope, true);
    try {
      assertKeyCapacity(store, key, scope);
      store.set(key, value);
    } catch (error) {
      if (!existed && store.size === 0) map.delete(contextId);
      throw error;
    }
  }

  function normalizeLimits(value) {
    const source = value ?? {};
    const normalized = {
      maxContexts: source.maxContexts ?? 256,
      maxKeysPerStore: source.maxKeysPerStore ?? 4096,
      maxTotalKeys: source.maxTotalKeys ?? 65536,
    };
    for (const [name, limit] of Object.entries(normalized)) {
      if (!Number.isInteger(limit) || limit < 1) {
        throw new TypeError(`state registry ${name} must be a positive integer`);
      }
    }
    return Object.freeze(normalized);
  }
  
  return {
    /**
     * 获取状态
     * 
     * @param {string} key - 状态键
     * @param {'sandbox'|'realm'} scope - 作用域
     * @param {string} [realmId] - Realm ID（scope 为 realm 时必须）
     * @returns {any}
     */
    get(key, scope = 'sandbox', realmId = null) {
      if (scope === 'sandbox') {
        const sandboxStore = contextStore(sandboxStates, realmId, 'sandbox');
        return sandboxStore?.get(key);
      }
      
      if (scope === 'realm') {
        const realmState = contextStore(realmStates, realmId, 'realm');
        return realmState?.get(key);
      }

      if (scope === 'app') {
        return appState.get(key);
      }

      if (scope === 'plugin') {
        const pluginState = contextStore(pluginStates, realmId, 'plugin');
        return pluginState?.get(key);
      }
      
      throw new Error(`Invalid scope: ${scope}`);
    },
    
    /**
     * 设置状态
     * 
     * @param {string} key - 状态键
     * @param {any} value - 状态值
     * @param {'sandbox'|'realm'} scope - 作用域
     * @param {string} [realmId] - Realm ID（scope 为 realm 时必须）
     */
    set(key, value, scope = 'sandbox', realmId = null) {
      if (scope === 'sandbox') {
        setInContext(sandboxStates, realmId, scope, key, value);
        return;
      }
      
      if (scope === 'realm') {
        setInContext(realmStates, realmId, scope, key, value);
        return;
      }

      if (scope === 'app') {
        assertKeyCapacity(appState, key, scope);
        appState.set(key, value);
        return;
      }

      if (scope === 'plugin') {
        setInContext(pluginStates, realmId, scope, key, value);
        return;
      }
      
      throw new Error(`Invalid scope: ${scope}`);
    },
    
    /**
     * 检查状态是否存在
     * 
     * @param {string} key - 状态键
     * @param {'sandbox'|'realm'} scope - 作用域
     * @param {string} [realmId] - Realm ID
     * @returns {boolean}
     */
    has(key, scope = 'sandbox', realmId = null) {
      if (scope === 'sandbox') {
        const sandboxStore = contextStore(sandboxStates, realmId, 'sandbox');
        return sandboxStore?.has(key) ?? false;
      }
      
      if (scope === 'realm') {
        const realmState = contextStore(realmStates, realmId, 'realm');
        return realmState?.has(key) ?? false;
      }

      if (scope === 'app') {
        return appState.has(key);
      }

      if (scope === 'plugin') {
        const pluginState = contextStore(pluginStates, realmId, 'plugin');
        return pluginState?.has(key) ?? false;
      }
      
      throw new Error(`Invalid scope: ${scope}`);
    },
    
    /**
     * 删除状态
     * 
     * @param {string} key - 状态键
     * @param {'sandbox'|'realm'} scope - 作用域
     * @param {string} [realmId] - Realm ID
     * @returns {boolean}
     */
    delete(key, scope = 'sandbox', realmId = null) {
      if (scope === 'sandbox') {
        const sandboxStore = contextStore(sandboxStates, realmId, 'sandbox');
        if (sandboxStore === undefined) return false;
        const deleted = sandboxStore.delete(key);
        if (sandboxStore.size === 0) sandboxStates.delete(realmId);
        return deleted;
      }
      
      if (scope === 'realm') {
        const realmState = contextStore(realmStates, realmId, 'realm');
        if (realmState === undefined) return false;
        const deleted = realmState.delete(key);
        if (realmState.size === 0) realmStates.delete(realmId);
        return deleted;
      }

      if (scope === 'app') {
        return appState.delete(key);
      }

      if (scope === 'plugin') {
        const pluginState = contextStore(pluginStates, realmId, 'plugin');
        if (pluginState === undefined) return false;
        const deleted = pluginState.delete(key);
        if (pluginState.size === 0) pluginStates.delete(realmId);
        return deleted;
      }
      
      throw new Error(`Invalid scope: ${scope}`);
    },
    
    /**
     * 清空指定作用域的所有状态
     * 
     * @param {'sandbox'|'realm'} scope - 作用域
     * @param {string} [realmId] - Realm ID
     */
    clear(scope = 'sandbox', realmId = null) {
      if (scope === 'sandbox') {
        if (realmId === null || realmId === undefined) {
          sandboxStates.clear();
        } else {
          const sandboxStore = contextStore(sandboxStates, realmId, 'sandbox');
          if (sandboxStore !== undefined) {
            sandboxStore.clear();
            sandboxStates.delete(realmId);
          }
        }
        return;
      }
      
      if (scope === 'realm') {
        if (realmId === null || realmId === undefined) {
          // 清空所有 realm；直接丢弃 bucket，避免空 Map 长期占位
          realmStates.clear();
        } else {
          // 清空指定 realm，并回收空 bucket
          const realmState = contextStore(realmStates, realmId, 'realm');
          if (realmState !== undefined) {
            realmState.clear();
            realmStates.delete(realmId);
          }
        }
        return;
      }

      if (scope === 'app') {
        appState.clear();
        return;
      }

      if (scope === 'plugin') {
        if (realmId === null || realmId === undefined) {
          pluginStates.clear();
        } else {
          const pluginState = contextStore(pluginStates, realmId, 'plugin');
          if (pluginState !== undefined) {
            pluginState.clear();
            pluginStates.delete(realmId);
          }
        }
        return;
      }
      
      throw new Error(`Invalid scope: ${scope}`);
    },
    
    /**
     * 销毁 Realm 状态
     * 
     * @param {string} realmId - Realm ID
     */
    destroyRealm(realmId) {
      if (typeof realmId !== 'string' || realmId.length === 0) return false;
      return realmStates.delete(realmId);
    },
    
    /**
     * Compatibility lifecycle API used by Core Sandbox.
     */
    destroyContext(scope, contextId) {
      if (scope === 'realm') {
        return realmStates.delete(contextId);
      } else if (scope === 'plugin') {
        return pluginStates.delete(contextId);
      } else if (scope === 'app') {
        appState.clear();
        return true;
      } else if (scope === 'sandbox') {
        return sandboxStates.delete(contextId);
      } else {
        throw new Error(`Invalid context scope: ${scope}`);
      }
    },

    /** 返回作用域桶的浅快照（调试/兼容 SDK StateAccessor）。 */
    snapshot(scope, contextId = null) {
      const store = scope === 'app' ? appState
        : scope === 'sandbox' ? sandboxStates.get(contextId)
        : scope === 'realm' ? realmStates.get(contextId)
        : scope === 'plugin' ? pluginStates.get(contextId)
        : null;
      if (store === null) throw new Error(`Invalid scope: ${scope}`);
      return store === undefined ? {} : Object.fromEntries(store);
    },
    
    /**
     * 获取调试信息
     */
    limits() {
      return limits;
    },

    stats() {
      let realmKeyCount = 0;
      for (const store of realmStates.values()) realmKeyCount += store.size;
      let sandboxKeyCount = 0;
      for (const store of sandboxStates.values()) sandboxKeyCount += store.size;
      return Object.freeze({
        sandboxKeys: sandboxKeyCount,
        appKeys: appState.size,
        realmContexts: realmStates.size,
        pluginContexts: pluginStates.size,
        realmKeys: realmKeyCount,
        totalKeys: totalKeyCount(),
      });
    },

    inspect() {
      return {
        sandboxes: Object.fromEntries(
          Array.from(sandboxStates.entries()).map(([sandboxId, state]) => [
            sandboxId,
            Object.fromEntries(state),
          ])
        ),
        app: Object.fromEntries(appState),
        realms: Object.fromEntries(
          Array.from(realmStates.entries()).map(([realmId, state]) => [
            realmId,
            Object.fromEntries(state),
          ])
        ),
        plugins: Object.fromEntries(
          Array.from(pluginStates.entries()).map(([pluginId, state]) => [
            pluginId,
            Object.fromEntries(state),
          ])
        ),
      };
    },
  };
}

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} StateRegistry
 * @property {function(string, string, string?): any} get
 * @property {function(string, any, string, string?): void} set
 * @property {function(string, string, string?): boolean} has
 * @property {function(string, string, string?): boolean} delete
 * @property {function(string, string?): void} clear
 * @property {function(string): void} destroyRealm
 * @property {function(): Object} inspect
 */
