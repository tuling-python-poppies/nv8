/**
 * Native Function Registry
 * 
 * 跨 Realm 的原生函数注册表，用于在不同 Realm 之间共享原生函数的源代码表示。
 * 这允许 Function.prototype.toString() 在所有 Realm 中返回一致的 "[native code]" 表示。
 */

/**
 * 创建原生函数注册表
 * 
 * @returns {NativeFunctionRegistry}
 */
export function createNativeFunctionRegistry() {
  const nativeFunctions = new WeakMap();
  
  return Object.freeze({
    /**
     * 注册原生函数及其源代码表示
     * 
     * @param {Function} callback - 函数对象
     * @param {string} source - 源代码字符串
     */
    register(callback, source) {
      if (typeof callback === 'function' && typeof source === 'string') {
        nativeFunctions.set(callback, source);
      }
    },
    
    /**
     * 检查函数是否已注册
     * 
     * @param {Function} callback - 函数对象
     * @returns {boolean}
     */
    has(callback) {
      return nativeFunctions.has(callback);
    },
    
    /**
     * 获取函数的源代码表示
     * 
     * @param {Function} callback - 函数对象
     * @returns {string|undefined}
     */
    source(callback) {
      return nativeFunctions.get(callback);
    },
  });
}

/**
 * @typedef {Object} NativeFunctionRegistry
 * @property {(callback: Function, source: string) => void} register - 注册原生函数
 * @property {(callback: Function) => boolean} has - 检查函数是否已注册
 * @property {(callback: Function) => string|undefined} source - 获取函数源代码
 */
