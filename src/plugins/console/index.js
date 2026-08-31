/**
 * @nv8/plugin-console
 * 
 * Console API
 * 
 * 提供能力：
 * - console.base: console 对象和所有方法
 */
export const consolePlugin = {
  id: "@nv8/plugin-console",
  version: "1.0.0",
  capabilities: ["console.base"],
  dependencies: [],
  
  install(sandbox, registry, config) {
    // Legacy installer retained for the bootstrap adapter. Core uses activate.
    // 注册全局表面
    registry.reserveGlobalSurface(this.id, "console");
  },
  
  async activate(context) {
    const realmConsole = {};
    const methods = [
      'debug', 'error', 'info', 'log', 'warn', 'dir', 'table',
      'trace', 'group', 'groupCollapsed', 'groupEnd', 'clear',
      'count', 'countReset', 'assert', 'time', 'timeLog', 'timeEnd',
      'timeStamp',
    ];
    for (const method of methods) {
      const hostMethod = typeof console[method] === 'function'
        ? console[method].bind(console)
        : console.log.bind(console);
      Object.defineProperty(realmConsole, method, {
        value: (...args) => hostMethod(...args),
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    context.global.console = realmConsole;
    context.exports.console = realmConsole;
  },
  
  reset(sandbox, registry) {
    // Console 不需要重置
  },
  
  dispose(sandbox, registry) {
    // 清理在 dispose 时处理
  },
};
