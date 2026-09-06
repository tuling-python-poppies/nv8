/**
 * @nv8/plugin-timers
 * 
 * Timers API
 * 
 * 提供能力：
 * - timers.base: setTimeout, setInterval 等
 */
const WINDOW_MESSAGING_URL = new URL(
  "../../surface/api/window/window-messaging.js",
  import.meta.url,
);
const NATIVE_FUNCTION_URL = new URL(
  "../../engine/webidl/native-function.js",
  import.meta.url,
);

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
    const { global, moduleLoader } = context;
    const messaging = await moduleLoader.importUrlAsync(WINDOW_MESSAGING_URL);
    const nativeFunctions = await moduleLoader.importUrlAsync(NATIVE_FUNCTION_URL);
    const capture = messaging?.namespace?.captureScheduledCallbackIncumbent;
    const notify = messaging?.namespace?.notifyScheduledCallbackIncumbent;
    if (typeof capture !== "function" || typeof notify !== "function") {
      throw new Error("Realm module loader cannot install timer incumbent bridge");
    }
    const disguise = nativeFunctions?.namespace?.registerNativeFunction;
    const nativeSetTimeout = global.setTimeout;
    const nativeSetInterval = global.setInterval;
    const nativeQueueMicrotask = global.queueMicrotask;
    const nativeClearTimeout = global.clearTimeout;
    const nativeClearInterval = global.clearInterval;
    const wrap = nativeSchedule => function (handler, delay, ...args) {
      if (typeof handler !== "function") {
        return Reflect.apply(nativeSchedule, this, [handler, delay, ...args]);
      }
      const source = capture();
      return Reflect.apply(nativeSchedule, this, [
        function (...callbackArgs) {
          notify(source);
          return Reflect.apply(handler, this, callbackArgs);
        },
        delay,
        ...args,
      ]);
    };
    const setTimeout = wrap(nativeSetTimeout, "setTimeout");
    const setInterval = wrap(nativeSetInterval, "setInterval");
    const queueMicrotask = function (handler) {
      if (typeof handler !== "function") {
        return Reflect.apply(nativeQueueMicrotask, this, [handler]);
      }
      const source = capture();
      return Reflect.apply(nativeQueueMicrotask, this, [
        () => {
          notify(source);
          handler();
        },
      ]);
    };
    disguise?.(setTimeout, "setTimeout");
    disguise?.(setInterval, "setInterval");
    disguise?.(queueMicrotask, "queueMicrotask");
    global.setTimeout = setTimeout;
    global.clearTimeout = nativeClearTimeout;
    global.setInterval = setInterval;
    global.clearInterval = nativeClearInterval;
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
