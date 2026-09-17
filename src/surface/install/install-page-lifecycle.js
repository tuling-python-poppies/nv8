import { Event } from '../api/event/event-constructor.js';
import { ensureEventTarget } from '../api/event/event-target-dispatch-event.js';
import { currentDocument } from '../api/dom/document-state.js';
import { setCurrentScript, setDocumentReadyState, setDocumentParserScriptExecutor } from '../api/dom/document-record.js';

export function ensureDocumentEventTargetForPage() {
  ensureEventTarget(globalThis);
  installGlobalEventTargetMethods();
  const document = currentDocument();
  if (document !== null) ensureDocumentEventTarget(document);
  const globalDocument = globalThis.document;
  if (globalDocument !== null && globalDocument !== undefined) {
    ensureDocumentEventTarget(globalDocument);
  }
}

function ensureDocumentEventTarget(document) {
  ensureEventTarget(document);
}

function installGlobalEventTargetMethods() {
  const prototype = globalThis.EventTarget?.prototype;
  if (prototype === undefined) return;
  for (const name of ['addEventListener', 'removeEventListener', 'dispatchEvent']) {
    if (typeof prototype[name] !== 'function' || globalThis[name] !== undefined) continue;
    Object.defineProperty(globalThis, name, {
      value: prototype[name],
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}

export function setPageLoading() {
  const document = currentDocument();
  if (document !== null) setDocumentReadyState(document, 'loading');
}

export function setPageInteractive() {
  const document = currentDocument();
  if (document !== null) setDocumentReadyState(document, 'interactive');
}

export function setPageComplete() {
  const document = currentDocument();
  if (document !== null) setDocumentReadyState(document, 'complete');
}

export function setDocumentParserScriptExecutorForPage(callback) {
  const document = currentDocument();
  if (document !== null) setDocumentParserScriptExecutor(document, callback);
}

export function setCurrentScriptElement(script) {
  const document = currentDocument();
  if (document !== null) setCurrentScript(document, script);
}

export function setCurrentScriptFromGlobal() {
  const document = currentDocument();
  if (document !== null) setCurrentScript(document, globalThis.__nv8CurrentScript ?? null);
}

export function clearCurrentScript() {
  const document = currentDocument();
  if (document !== null) setCurrentScript(document, null);
  try {
    delete globalThis.__nv8CurrentScript;
  } catch {
    globalThis.__nv8CurrentScript = undefined;
  }
}

export function dispatchDOMContentLoaded() {
  const document = currentDocument();
  if (document === null) return;
  ensureDocumentEventTarget(document);
  setDocumentReadyState(document, 'interactive');

  // 规范：DOMContentLoaded 在 document 上派发并**冒泡**到 window。
  //
  // 只派发一次、靠冒泡到达 window。实测冒泡确实生效，若再在 window 上补一次
  // 派发，`window.addEventListener('DOMContentLoaded')` 会被触发两次。
  ensureEventTarget(globalThis);
  document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
}

export function dispatchLoad() {
  const document = currentDocument();
  if (document === null) return;
  ensureDocumentEventTarget(document);
  setDocumentReadyState(document, 'complete');

  // 规范：load 在 **window** 上派发（`window.onload`），不冒泡。
  //
  // 迁移前只在 document 上派发，而 load 规范上 `bubbles: false`，
  // 所以 `window.addEventListener('load', ...)` 永远收不到——这是最常见的
  // 页面就绪钩子写法。
  //
  // **不往 document 上补派一份。** 真实 Edge 151 实测（本地 HTTP 服务器 +
  // headless）：
  //
  //   ["document:DCL", "window:DCL", "window:load"]
  //
  // `document.addEventListener('load')` 在真实浏览器里**从不触发**。
  // 曾以「向后兼容」为由额外派一份，那是可检测的偏差。
  ensureEventTarget(globalThis);
  globalThis.dispatchEvent(new Event('load'));
}

/**
 * 派发 `beforeunload`，返回导航是否应该继续。
 *
 * 三条异议路径（Chromium 全部支持，真实页面里后两条比第一条还常见）：
 *
 * 1. `event.preventDefault()`
 * 2. `event.returnValue = '非空字符串'`
 * 3. `onbeforeunload` 处理器返回非空字符串
 *
 * 第 2 条必须在**这里**判而不能放在 `returnValue` 的 setter 里。真实 Edge 151
 * 实测（在真实导航的 beforeunload 处理器内量）：
 *
 * ```
 * { before: false, afterAssign: false, afterPreventDefault: true, returnValue: "stay" }
 * ```
 *
 * 赋值 `returnValue` **不会**置上 canceled 标志（`defaultPrevented` 仍为
 * false）——浏览器是在派发结束后**单独**检查 `returnValue` 是否非空。
 * 把规则塞进 setter 会让 `defaultPrevented` 说谎。
 *
 * @returns {boolean} true 表示可以继续导航
 */
export function dispatchBeforeUnload() {
  ensureEventTarget(globalThis);
  // BeforeUnloadEvent 对页面脚本不可构造（真实 Edge 实测抛
  // `Illegal constructor`），但内部必须造出一个能被**本 Realm** 的
  // dispatchEvent 认出来的事件。
  //
  // 不能走另一个模块实例的内部构造器：event-state 的 WeakMap 是模块级的，
  // 跨实例造出的事件在 `globalThis.dispatchEvent` 里会被当成非 Event
  // （requireEvent 抛 Illegal invocation），取消整体失效。plugin 模式尤其
  // 如此——那里压根没安装 longtail events。
  //
  // 因此：用**本 Realm 的 Event** 造实例（肯定能被认出），再把原型改成
  // BeforeUnloadEvent.prototype，让 `instanceof` 与 `constructor.name` 正确。
  const event = new Event('beforeunload', { cancelable: true });
  const BeforeUnload = globalThis.BeforeUnloadEvent;
  if (typeof BeforeUnload === 'function' && BeforeUnload.prototype !== undefined) {
    Object.setPrototypeOf(event, BeforeUnload.prototype);
    // 原型上的 `returnValue` 访问器由 longtail 记录支撑，而这个事件没有记录，
    // 读写都会抛。用自有属性遮蔽它，让页面处理器里的
    // `event.returnValue = 'stay'` 能正常工作。
    Object.defineProperty(event, 'returnValue', {
      value: '',
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
  if (globalThis.dispatchEvent(event) === false) return false;

  // 历史路径：非空 returnValue 等同异议。降级到普通 Event 时
  // `returnValue` 是布尔值（旧的 IE 语义），所以限定字符串。
  const returnValue = event.returnValue;
  if (typeof returnValue === 'string' && returnValue !== '') return false;
  return true;
}

/**
 * 页面卸载：pagehide 与 unload。
 *
 * 两者都在 **window** 上派发。真实 Edge 151 实测（iframe 内导航，
 * 同时在 window 和 document 上挂监听器）：
 *
 * ```
 * ["child:ready", "window:beforeunload", "window:pagehide", "window:unload"]
 * ```
 *
 * document 监听器**一个都没触发**。迁移前反了：只在 document 上派发，
 * 所以 `window.addEventListener('unload')` 永远收不到，而
 * `document.addEventListener('unload')` 反而会触发——两侧都与真实浏览器相反。
 *
 * 派发顺序也按实测：pagehide 在 unload 之前。
 */
export function dispatchPageHideAndUnload() {
  ensureEventTarget(globalThis);
  // pagehide 在规范里是 PageTransitionEvent，带 `persisted` 属性。
  // 离线重放没有 back/forward cache，所以 persisted 恒为 false。
  const PageTransition = typeof globalThis.PageTransitionEvent === 'function'
    ? globalThis.PageTransitionEvent
    : null;
  const pagehide = PageTransition === null
    ? new Event('pagehide')
    : new PageTransition('pagehide', { persisted: false });
  globalThis.dispatchEvent(pagehide);
  globalThis.dispatchEvent(new Event('unload'));
}
