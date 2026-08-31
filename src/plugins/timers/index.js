/**
 * @nv8/plugin-timers
 * 
 * Timers API
 * 
 * 提供能力：
 * - timers.base: setTimeout, setInterval 等
 */
export const timersPlugin = {
  id: "@nv8/plugin-timers",
  version: "1.0.0",
  capabilities: ["timers.base"],
  dependencies: [],
  
  install(sandbox, registry, config) {
    // Legacy installer retained for the bootstrap adapter. Core uses activate.
    registry.reserveGlobalSurface(this.id, "setTimeout");
    registry.reserveGlobalSurface(this.id, "clearTimeout");
    registry.reserveGlobalSurface(this.id, "setInterval");
    registry.reserveGlobalSurface(this.id, "clearInterval");
  },
  
  async activate(context) {
    const { global } = context;
    global.setTimeout = setTimeout;
    global.clearTimeout = clearTimeout;
    global.setInterval = setInterval;
    global.clearInterval = clearInterval;
    global.queueMicrotask = queueMicrotask;
    context.exports.setTimeout = global.setTimeout;
  },
  
  reset(sandbox, registry) {
    // 清除所有待执行的定时器
  },
  
  dispose(sandbox, registry) {
    // 清理定时器
  },
};
