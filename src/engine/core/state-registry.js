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
  // sandbox -> { key -> value }
  // realm -> { realmId -> { key -> value } }
  const sandboxState = new Map();
  const realmStates = new Map();

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
    let count = sandboxState.size;
    for (const store of realmStates.values()) count += store.size;
    return count;
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
        return sandboxState.get(key);
      }
      
      if (scope === 'realm') {
        const realmState = contextStore(realmStates, realmId, 'realm');
        return realmState?.get(key);
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
        assertKeyCapacity(sandboxState, key, scope);
        sandboxState.set(key, value);
        return;
      }
      
      if (scope === 'realm') {
        const existed = realmStates.has(realmId);
        const realmState = contextStore(realmStates, realmId, scope, true);
        try {
          assertKeyCapacity(realmState, key, scope);
          realmState.set(key, value);
        } catch (error) {
          // 容量拒绝必须是原子的：不能留下一个空的 realm bucket，
          // 否则反复尝试会耗尽 context 配额。
          if (!existed && realmState.size === 0) realmStates.delete(realmId);
          throw error;
        }
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
        return sandboxState.has(key);
      }
      
      if (scope === 'realm') {
        const realmState = contextStore(realmStates, realmId, 'realm');
        return realmState?.has(key) ?? false;
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
        return sandboxState.delete(key);
      }
      
      if (scope === 'realm') {
        const realmState = contextStore(realmStates, realmId, 'realm');
        if (realmState === undefined) return false;
        const deleted = realmState.delete(key);
        if (realmState.size === 0) realmStates.delete(realmId);
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
        sandboxState.clear();
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
      } else if (scope === 'sandbox') {
        sandboxState.clear();
        return true;
      } else {
        throw new Error(`Invalid context scope: ${scope}`);
      }
    },
    
    /**
     * 获取调试信息
     */
    limits() {
      return limits;
    },

    stats() {
      return Object.freeze({
        sandboxKeys: sandboxState.size,
        realmContexts: realmStates.size,
        realmKeys: totalKeyCount() - sandboxState.size,
        totalKeys: totalKeyCount(),
      });
    },

    inspect() {
      return {
        sandbox: Object.fromEntries(sandboxState),
        realms: Object.fromEntries(
          Array.from(realmStates.entries()).map(([realmId, state]) => [
            realmId,
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
