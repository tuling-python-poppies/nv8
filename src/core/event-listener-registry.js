/**
 * EventListener Registry
 * 
 * 跨 Realm 的事件监听器注册表，用于插件之间协调事件处理
 */

/**
 * 创建 EventListener Registry
 * 
 * @returns {EventListenerRegistry}
 */
export function createEventListenerRegistry() {
  // target -> eventType -> listeners[]
  const listenerMap = new WeakMap();
  
  return {
    /**
     * 注册事件监听器
     * 
     * @param {EventTarget} target - 事件目标
     * @param {string} type - 事件类型
     * @param {Function} listener - 监听器函数
     * @param {AddEventListenerOptions} options - 监听器选项
     */
    register(target, type, listener, options = {}) {
      if (!listenerMap.has(target)) {
        listenerMap.set(target, new Map());
      }
      
      const typeMap = listenerMap.get(target);
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      
      const listeners = typeMap.get(type);
      
      // 检查是否已存在
      const exists = listeners.some(
        l => l.listener === listener && l.capture === !!options.capture
      );
      
      if (!exists) {
        listeners.push({
          listener,
          capture: !!options.capture,
          once: !!options.once,
          passive: !!options.passive,
          signal: options.signal,
        });
      }
    },
    
    /**
     * 移除事件监听器
     * 
     * @param {EventTarget} target - 事件目标
     * @param {string} type - 事件类型
     * @param {Function} listener - 监听器函数
     * @param {boolean} capture - 是否捕获阶段
     */
    unregister(target, type, listener, capture = false) {
      const typeMap = listenerMap.get(target);
      if (!typeMap) return;
      
      const listeners = typeMap.get(type);
      if (!listeners) return;
      
      const index = listeners.findIndex(
        l => l.listener === listener && l.capture === capture
      );
      
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      
      // 清理空数组
      if (listeners.length === 0) {
        typeMap.delete(type);
      }
      if (typeMap.size === 0) {
        listenerMap.delete(target);
      }
    },
    
    /**
     * 获取事件监听器列表
     * 
     * @param {EventTarget} target - 事件目标
     * @param {string} type - 事件类型
     * @returns {Array}
     */
    getListeners(target, type) {
      const typeMap = listenerMap.get(target);
      if (!typeMap) return [];
      
      return typeMap.get(type) || [];
    },
    
    /**
     * 检查是否有监听器
     * 
     * @param {EventTarget} target - 事件目标
     * @param {string} type - 事件类型
     * @returns {boolean}
     */
    hasListeners(target, type) {
      const typeMap = listenerMap.get(target);
      if (!typeMap) return false;
      
      const listeners = typeMap.get(type);
      return listeners && listeners.length > 0;
    },
    
    /**
     * 清理目标的所有监听器
     * 
     * @param {EventTarget} target - 事件目标
     */
    clearTarget(target) {
      listenerMap.delete(target);
    },
    
    /**
     * 清理目标的特定类型监听器
     * 
     * @param {EventTarget} target - 事件目标
     * @param {string} type - 事件类型
     */
    clearType(target, type) {
      const typeMap = listenerMap.get(target);
      if (!typeMap) return;
      
      typeMap.delete(type);
      
      if (typeMap.size === 0) {
        listenerMap.delete(target);
      }
    },
  };
}

/**
 * @typedef {Object} EventListenerRegistry
 * @property {function} register - 注册监听器
 * @property {function} unregister - 移除监听器
 * @property {function} getListeners - 获取监听器列表
 * @property {function} hasListeners - 检查是否有监听器
 * @property {function} clearTarget - 清理目标的所有监听器
 * @property {function} clearType - 清理目标的特定类型监听器
 */
