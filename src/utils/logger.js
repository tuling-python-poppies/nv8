/**
 * Logger 工具
 * 
 * 提供简单的日志输出功能
 */

/**
 * 创建 Logger
 * 
 * @param {LoggerOptions} options
 * @returns {Logger}
 */
export function createLogger(options = {}) {
  const {
    level = 'info',
    prefix = '[Nv8]',
    enabled = true,
  } = options;
  
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  
  const currentLevel = levels[level] ?? levels.info;
  
  function shouldLog(logLevel) {
    return enabled && levels[logLevel] >= currentLevel;
  }
  
  return {
    debug(...args) {
      if (shouldLog('debug')) {
        console.debug(prefix, ...args);
      }
    },
    
    info(...args) {
      if (shouldLog('info')) {
        console.info(prefix, ...args);
      }
    },
    
    warn(...args) {
      if (shouldLog('warn')) {
        console.warn(prefix, ...args);
      }
    },
    
    error(...args) {
      if (shouldLog('error')) {
        console.error(prefix, ...args);
      }
    },
    
    /**
     * 创建子 Logger（带新前缀）
     */
    child(childPrefix) {
      return createLogger({
        ...options,
        prefix: `${prefix} ${childPrefix}`,
      });
    },
  };
}

/**
 * TypeScript 类型定义
 * 
 * @typedef {Object} LoggerOptions
 * @property {'debug'|'info'|'warn'|'error'} [level] - 日志级别
 * @property {string} [prefix] - 日志前缀
 * @property {boolean} [enabled] - 是否启用日志
 * 
 * @typedef {Object} Logger
 * @property {function(...any): void} debug
 * @property {function(...any): void} info
 * @property {function(...any): void} warn
 * @property {function(...any): void} error
 * @property {function(string): Logger} child
 */
