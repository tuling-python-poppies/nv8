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
export function createStateRegistry() {
  // 状态存储结构：
  // sandbox -> { key -> value }
  // realm -> { realmId -> { key -> value } }
  const sandboxState = new Map();
  const realmStates = new Map();
  
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
        if (!realmId) {
          throw new Error('realmId is required for realm scope');
        }
        const realmState = realmStates.get(realmId);
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
        sandboxState.set(key, value);
        return;
      }
      
      if (scope === 'realm') {
        if (!realmId) {
          throw new Error('realmId is required for realm scope');
        }
        
        if (!realmStates.has(realmId)) {
          realmStates.set(realmId, new Map());
        }
        
        realmStates.get(realmId).set(key, value);
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
        if (!realmId) {
          throw new Error('realmId is required for realm scope');
        }
        const realmState = realmStates.get(realmId);
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
        if (!realmId) {
          throw new Error('realmId is required for realm scope');
        }
        const realmState = realmStates.get(realmId);
        return realmState?.delete(key) ?? false;
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
        if (!realmId) {
          // 清空所有 realm
          realmStates.clear();
        } else {
          // 清空指定 realm
          realmStates.get(realmId)?.clear();
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
      realmStates.delete(realmId);
    },
    
    /**
     * Compatibility lifecycle API used by Core Sandbox.
     */
    destroyContext(scope, contextId) {
      if (scope === 'realm') {
        realmStates.delete(contextId);
      } else if (scope === 'sandbox') {
        sandboxState.clear();
      } else {
        throw new Error(`Invalid context scope: ${scope}`);
      }
    },
    
    /**
     * 获取调试信息
     */
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
