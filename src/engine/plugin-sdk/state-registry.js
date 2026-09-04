/**
 * Plugin SDK - State Registry
 * 
 * 提供插件状态管理，支持多种作用域：
 * - 'plugin': 插件私有状态（每个插件实例独立）
 * - 'sandbox': Sandbox 全局状态（同一 sandbox 内所有插件共享）
 * - 'realm': Realm 状态（同一 realm 内的插件共享）
 * - 'app': App 全局状态（整个应用共享）
 */

/**
 * 创建状态注册表
 */
export function createStateRegistry() {
  // 四层存储
  const appStore = new Map();        // app 级别
  const sandboxStores = new Map();   // sandbox-id -> Map
  const realmStores = new Map();     // realm-id -> Map
  const pluginStores = new Map();    // plugin-instance-id -> Map
  
  return {
    /**
     * 获取状态
     * 
     * @param {string} key - 状态键
     * @param {'plugin'|'sandbox'|'realm'|'app'} scope - 作用域
     * @param {string} [contextId] - 上下文 ID (plugin-instance-id / realm-id / sandbox-id)
     * @returns {any} 状态值
     */
    get(key, scope, contextId) {
      const store = getStore(scope, contextId);
      return store?.get(key);
    },
    
    /**
     * 设置状态
     * 
     * @param {string} key - 状态键
     * @param {any} value - 状态值
     * @param {'plugin'|'sandbox'|'realm'|'app'} scope - 作用域
     * @param {string} [contextId] - 上下文 ID
     */
    set(key, value, scope, contextId) {
      const store = ensureStore(scope, contextId);
      store.set(key, value);
    },
    
    /**
     * 删除状态
     */
    delete(key, scope, contextId) {
      const store = getStore(scope, contextId);
      return store?.delete(key) || false;
    },
    
    /**
     * 检查状态是否存在
     */
    has(key, scope, contextId) {
      const store = getStore(scope, contextId);
      return store?.has(key) || false;
    },
    
    /**
     * 清空指定作用域的所有状态
     */
    clear(scope, contextId) {
      const store = getStore(scope, contextId);
      store?.clear();
    },
    
    /**
     * 销毁上下文（清理内存）
     */
    destroyContext(scope, contextId) {
      if (scope === 'sandbox') {
        sandboxStores.delete(contextId);
      } else if (scope === 'realm') {
        realmStores.delete(contextId);
      } else if (scope === 'plugin') {
        pluginStores.delete(contextId);
      } else if (scope === 'app') {
        appStore.clear();
      }
    },
    
    /**
     * 获取所有键（调试用）
     */
    keys(scope, contextId) {
      const store = getStore(scope, contextId);
      return store ? Array.from(store.keys()) : [];
    },
    
    /**
     * 获取状态快照（调试用）
     */
    snapshot(scope, contextId) {
      const store = getStore(scope, contextId);
      if (!store) return {};
      
      const result = {};
      for (const [key, value] of store.entries()) {
        result[key] = value;
      }
      return result;
    },
  };
  
  /**
   * 获取存储实例
   */
  function getStore(scope, contextId) {
    if (scope === 'app') {
      return appStore;
    }
    
    if (scope === 'sandbox') {
      return sandboxStores.get(contextId);
    }
    
    if (scope === 'realm') {
      return realmStores.get(contextId);
    }
    
    if (scope === 'plugin') {
      return pluginStores.get(contextId);
    }
    
    throw new Error(`Invalid state scope: ${scope}`);
  }
  
  /**
   * 确保存储实例存在
   */
  function ensureStore(scope, contextId) {
    if (scope === 'app') {
      return appStore;
    }
    
    if (scope === 'sandbox') {
      if (!sandboxStores.has(contextId)) {
        sandboxStores.set(contextId, new Map());
      }
      return sandboxStores.get(contextId);
    }
    
    if (scope === 'realm') {
      if (!realmStores.has(contextId)) {
        realmStores.set(contextId, new Map());
      }
      return realmStores.get(contextId);
    }
    
    if (scope === 'plugin') {
      if (!pluginStores.has(contextId)) {
        pluginStores.set(contextId, new Map());
      }
      return pluginStores.get(contextId);
    }
    
    throw new Error(`Invalid state scope: ${scope}`);
  }
}

/**
 * 创建状态访问器（绑定到特定上下文）
 * 
 * 这个函数用于在插件上下文中提供简化的 API
 */
export function createStateAccessor(registry, pluginInstanceId, realmId, sandboxId) {
  return {
    /**
     * 获取插件私有状态
     */
    get(key) {
      return registry.get(key, 'plugin', pluginInstanceId);
    },
    
    /**
     * 设置插件私有状态
     */
    set(key, value) {
      registry.set(key, value, 'plugin', pluginInstanceId);
    },
    
    /**
     * 删除插件私有状态
     */
    delete(key) {
      return registry.delete(key, 'plugin', pluginInstanceId);
    },
    
    /**
     * 检查插件私有状态
     */
    has(key) {
      return registry.has(key, 'plugin', pluginInstanceId);
    },
    
    /**
     * 获取其他作用域的状态
     */
    getScoped(key, scope) {
      const contextId = getContextId(scope);
      return registry.get(key, scope, contextId);
    },
    
    /**
     * 设置其他作用域的状态
     */
    setScoped(key, value, scope) {
      const contextId = getContextId(scope);
      registry.set(key, value, scope, contextId);
    },
    
    /**
     * 删除其他作用域的状态
     */
    deleteScoped(key, scope) {
      const contextId = getContextId(scope);
      return registry.delete(key, scope, contextId);
    },
    
    /**
     * 检查其他作用域的状态
     */
    hasScoped(key, scope) {
      const contextId = getContextId(scope);
      return registry.has(key, scope, contextId);
    },
    
    /**
     * 清空插件私有状态
     */
    clear() {
      registry.clear('plugin', pluginInstanceId);
    },
    
    /**
     * 获取快照（调试）
     */
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
 * @param {string} key - 状态键
 * @param {'plugin'|'sandbox'|'realm'|'app'} scope - 作用域
 * @param {any} contextId - 上下文 ID
 * @param {Function} [init] - 初始化函数，如果状态不存在则调用
 * @returns {any} 状态值
 */
export function getState(key, scope, contextId, init) {
  // 获取全局状态注册表（假设在某处已创建）
  if (!globalThis.__nv8StateRegistry) {
    globalThis.__nv8StateRegistry = createStateRegistry();
  }
  
  const registry = globalThis.__nv8StateRegistry;
  
  if (!registry.has(key, scope, contextId) && typeof init === 'function') {
    const value = init();
    registry.set(key, value, scope, contextId);
    return value;
  }
  
  return registry.get(key, scope, contextId);
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

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} StateRegistry
 * @property {function(string, string, string=): any} get
 * @property {function(string, any, string, string=): void} set
 * @property {function(string, string, string=): boolean} delete
 * @property {function(string, string, string=): boolean} has
 * @property {function(string, string=): void} clear
 * @property {function(string, string): void} destroyContext
 * @property {function(string, string=): string[]} keys
 * @property {function(string, string=): Object} snapshot
 * 
 * @typedef {Object} StateAccessor
 * @property {function(string): any} get
 * @property {function(string, any): void} set
 * @property {function(string): boolean} delete
 * @property {function(string): boolean} has
 * @property {function(string, string): any} getScoped
 * @property {function(string, any, string): void} setScoped
 * @property {function(string, string): boolean} deleteScoped
 * @property {function(string, string): boolean} hasScoped
 * @property {function(): void} clear
 * @property {function(string=): Object} snapshot
 */
