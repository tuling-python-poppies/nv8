import {
  captureScheduledCallbackIncumbent,
  notifyScheduledCallbackIncumbent,
} from "../api/window/window-messaging.js";
import { defineGlobalFunction } from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";

/**
 * 为 legacy/plugin 共用的宿主 timer bridge 增加 Realm 内 incumbent 包装。
 *
 * 该 installer 必须在 Realm 模块图中求值：如果由宿主插件代码创建包装函数，
 * `setTimeout.constructor` 会回到宿主 Function，重新形成沙箱逃逸旁路。
 */
export function installTimerBridge() {
  const nativeSetTimeout = globalThis.setTimeout;
  const nativeSetInterval = globalThis.setInterval;
  const nativeQueueMicrotask = globalThis.queueMicrotask;

  const wrap = (nativeSchedule, name) => function (handler, delay, ...args) {
    if (typeof handler !== "function") {
      return Reflect.apply(nativeSchedule, this, [handler, delay, ...args]);
    }
    const incumbent = captureScheduledCallbackIncumbent();
    return Reflect.apply(nativeSchedule, this, [
      function (...callbackArgs) {
        notifyScheduledCallbackIncumbent(incumbent);
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
    const incumbent = captureScheduledCallbackIncumbent();
    return Reflect.apply(nativeQueueMicrotask, this, [
      () => {
        notifyScheduledCallbackIncumbent(incumbent);
        return handler();
      },
    ]);
  };

  registerNativeFunction(setTimeout, "setTimeout");
  registerNativeFunction(setInterval, "setInterval");
  registerNativeFunction(queueMicrotask, "queueMicrotask");
  defineGlobalFunction("setTimeout", setTimeout);
  defineGlobalFunction("setInterval", setInterval);
  defineGlobalFunction("queueMicrotask", queueMicrotask);
}
