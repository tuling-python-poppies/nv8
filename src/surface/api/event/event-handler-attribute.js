import {
  initializeEventTarget,
  isEventTarget,
  requireEventTarget,
} from "./event-target-state.js";

/**
 * 事件处理器 IDL 属性（`onclick` 一类）与事件派发的桥接。
 *
 * 规范把事件处理器实现为**一个事件监听器**：`el.onclick = fn` 会注册一个
 * 监听器，因此它和 `addEventListener` 注册的监听器在同一个列表里，按注册
 * 顺序触发。
 *
 * NV8 迁移前 element 与 document 的 `on*` 属性只是存储——读写正常，
 * `typeof el.onclick === 'function'`，但**派发时完全不被调用**：
 *
 * ```js
 * el.onclick = () => log.push('handler');
 * el.dispatchEvent(new Event('click'));   // handler 从未执行
 * ```
 *
 * `el.onclick = fn` 在真实页面里极其常见，静默失效会让整段逻辑消失。
 * window 的处理器早已接好（`window-event-handler-state.js`），只有 element
 * 和 document 漏了。
 *
 * ## 重新赋值不改变位置
 *
 * 注册的是一个**稳定的代理监听器**，它每次触发时读取当前处理器值。因此
 *
 * ```js
 * el.onclick = first;              // 位置 0
 * el.addEventListener('click', second);  // 位置 1
 * el.onclick = third;              // 仍在位置 0，不会跑到 second 后面
 * ```
 *
 * 规范要求如此。先移除再重新添加会让处理器跳到列表末尾，改变触发顺序。
 * 置为 `null` 时代理保留注册但不做任何事——同样是为了保住位置。
 */

/**
 * 判断值是否是合法的事件处理器。
 *
 * 与 `addEventListener` 一致地接受 `handleEvent` 对象。
 *
 * @param {unknown} value
 * @returns {boolean}
 */
function isEventHandlerValue(value) {
  if (typeof value === "function") return true;
  return value !== null
    && typeof value === "object"
    && typeof value.handleEvent === "function";
}

/**
 * 确保某个处理器名对应的代理监听器已注册。
 *
 * @param {object} target EventTarget
 * @param {Map} handlers 存放处理器值的 Map，键是 `onclick` 这样的完整名字
 * @param {Map} listeners 存放已注册代理的 Map，防止重复注册
 * @param {string} name 形如 `onclick`
 */
function ensureEventHandlerListener(target, handlers, listeners, name) {
  if (listeners.has(name)) return;
  if (!isEventHandlerValue(handlers.get(name) ?? null)) return;

  if (!isEventTarget(target)) initializeEventTarget(target);

  const listener = event => {
    // 每次触发都重新读取：重新赋值不该改变监听器位置
    const current = handlers.get(name) ?? null;
    if (typeof current === "function") {
      return Reflect.apply(current, target, [event]);
    }
    if (isEventHandlerValue(current)) {
      return Reflect.apply(current.handleEvent, current, [event]);
    }
    return undefined;
  };

  listeners.set(name, listener);

  // 直接写内部 listener 列表而不是调用公开的 addEventListener：
  // 公开方法带 WebIDL 转换与 trace，处理器桥接不该出现在调用者的 trace 里。
  const type = name.slice(2);
  const registry = requireEventTarget(target).listeners;
  const existing = registry.get(type);
  const entry = {
    callback: listener,
    capture: false,
    once: false,
    passive: false,
    removed: false,
  };
  if (existing === undefined) {
    registry.set(type, [entry]);
  } else {
    existing.push(entry);
  }
}

/**
 * 将事件处理器**内容属性**的源码编译成函数。
 *
 * `<div onclick="doThing()">` 里的字符串在真实浏览器里会被编译成一个以
 * `event` 为形参的函数，因此 `typeof el.onclick === 'function'`。NV8 迁移前
 * 只存下属性值，`el.onclick` 是 `null`——属性存在但处理器不存在。
 *
 * 编译失败（语法错误）时返回 `null`：浏览器把它当成脚本错误报告，
 * 而不是从 `setAttribute` 里抛出。
 *
 * @param {string} source 属性值
 * @returns {Function|null}
 */
export function compileEventHandlerAttribute(source) {
  const FunctionConstructor = globalThis.Function;
  if (typeof FunctionConstructor !== "function") return null;
  try {
    // 形参名必须是 `event`：内联处理器里写 `event.preventDefault()` 是
    // 普遍用法，换成其他名字会让这类代码报 ReferenceError。
    return new FunctionConstructor("event", `${source}`);
  } catch {
    return null;
  }
}

/**
 * 判断属性名是否对应一个真正的事件处理器 IDL 属性。
 *
 * 靠原型链上有没有 setter 来判，而不是维护一份名字白名单——名单会与
 * 实际安装的属性集合漂移。`onfoo` 这类 expando 不会误判。
 *
 * @param {object} element
 * @param {string} name
 * @returns {boolean}
 */
export function isEventHandlerAttributeName(element, name) {
  if (!name.startsWith("on") || name.length <= 2) return false;
  let prototype = Object.getPrototypeOf(element);
  while (prototype !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (descriptor !== undefined) return typeof descriptor.set === "function";
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}

/**
 * 写入处理器值并按需注册代理监听器。
 *
 * @param {object} target
 * @param {Map} handlers
 * @param {Map} listeners
 * @param {string} name
 * @param {unknown} value
 */
export function assignEventHandler(target, handlers, listeners, name, value) {
  handlers.set(name, isEventHandlerValue(value) ? value : null);
  ensureEventHandlerListener(target, handlers, listeners, name);
}
