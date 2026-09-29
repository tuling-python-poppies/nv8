import { withWindowEvent } from "./window-state-globals-runtime.js";
import { getState } from '../../../engine/plugin-sdk/state-registry.js';
import { isErrorEvent } from "../general-events/general-events-runtime.js";

function getHandlers(realm) {
  return getState('window-event-handler:handlers', 'realm', realm, () => new Map());
}

function getListeners(realm) {
  return getState('window-event-handler:listeners', 'realm', realm, () => new Map());
}

export function getWindowEventHandler(name, realm = globalThis) {
  const handlers = getHandlers(realm);
  return handlers.get(name) ?? null;
}

export function setWindowEventHandler(name, value, realm = globalThis) {
  const handlers = getHandlers(realm);
  const listeners = getListeners(realm);
  const type = name.slice(2);
  const previous = listeners.get(name);
  if (previous !== undefined) {
    realm.removeEventListener(type, previous);
    listeners.delete(name);
  }
  if (!isEventHandler(value)) {
    handlers.delete(name);
    return;
  }
  handlers.set(name, value);
  const listener = event => withWindowEvent(event, () => {
    // Window 的 `onerror` 是 [SpecialOperation]：ErrorEvent 触发时按
    // (message, filename, lineno, colno, error) 五参调用，返回 true 取消
    // 默认动作（console 不再打印 Uncaught ...）。`{ handleEvent }` 对象
    // 形式不走特例，与真实浏览器一致。
    if (type === "error" && isErrorEvent(event)) {
      if (typeof value === "function") {
        const result = Reflect.apply(value, realm, [
          event.message,
          event.filename,
          event.lineno,
          event.colno,
          event.error,
        ]);
        if (result === true) {
          event.preventDefault();
        }
        return result;
      }
      return Reflect.apply(value.handleEvent, value, [event]);
    }
    const result = typeof value === "function"
      ? Reflect.apply(value, realm, [event])
      : Reflect.apply(value.handleEvent, value, [event]);
    if (
      type === "beforeunload"
      && typeof result === "string"
      && result !== ""
    ) {
      // 处理器返回的非空字符串要写进 `event.returnValue`。
      // 真实 Edge 151 实测（真实导航的 beforeunload 处理器内）：
      //   { returnValue: "stay", afterPreventDefault: true }
      // 只调 preventDefault 而不写 returnValue 会让读回值为空。
      try {
        event.returnValue = result;
      } catch {
        // 降级到普通 Event 时没有字符串型 returnValue，忽略
      }
      event.preventDefault();
    }
    return result;
  });
  listeners.set(name, listener);
  realm.addEventListener(type, listener);
}

function isEventHandler(value) {
  return typeof value === "function"
    || (
      value !== null
      && typeof value === "object"
      && typeof value.handleEvent === "function"
    );
}
