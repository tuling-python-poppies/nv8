import {
  getAttributeValue,
  requireElement,
} from "./element-state.js";
import { descendants, registerMutationHook } from "./node-state.js";
import {
  createWindowFacade,
  enqueueWindowMessage,
  normalizePostMessageTarget,
  registerIncumbentSource,
  transferOptions,
} from "../window/window-messaging.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { createRealmSlot } from "../../core/state-scope.js";

const state = new WeakMap();

// 子 Realm 工厂、父页面 URL 与 frame 索引集合原先是模块级状态，
// 会让宿主图上不同 Realm 的 iframe 相互串扰。
const iframeSlot = createRealmSlot(() => ({
  createChildRealm: null,
  parentPageUrl: "https://sandbox.test/",
  installedFrameIndices: new Set(),
  synchronizingFrameIndices: false,
}), "iframe-realm-state");

function iframeScope() {
  return iframeSlot.get(globalThis);
}

export function configureIFrameRealms(factory, pageUrl) {
  const scope = iframeScope();
  scope.createChildRealm = typeof factory === "function" ? factory : null;
  scope.parentPageUrl = `${pageUrl}`;
}

export function iframeContentWindow(element) {
  requireIFrame(element);
  const record = state.get(element);
  if (record === undefined) return null;
  if (record.sameOrigin) {
    return record.handle?.window ?? record.pendingWindow ?? record.lastWindow;
  }
  return record.facade;
}

export function iframeContentDocument(element) {
  requireIFrame(element);
  const record = state.get(element);
  if (record === undefined || !record.sameOrigin) return null;
  const window = record.handle?.window
    ?? record.pendingWindow
    ?? record.lastWindow;
  return window?.document ?? null;
}

export function iframeSVGDocument(element) {
  const document = iframeContentDocument(element);
  return document?.contentType === "image/svg+xml" ? document : null;
}

registerMutationHook(record => {
  if (iframeScope().createChildRealm === null) return;
  if (record.type === "attributes") {
    if (
      isIFrame(record.target)
      && record.target.isConnected
      && ["src", "srcdoc"].includes(record.attributeName)
    ) {
      navigate(record.target);
    }
    return;
  }
  if (record.type !== "childList") return;
  for (const node of record.addedNodes) {
    if (isIFrame(node)) navigate(node);
    for (const child of descendants(node)) {
      if (isIFrame(child)) navigate(child);
    }
  }
  for (const node of record.removedNodes) {
    if (isIFrame(node)) dispose(node);
    for (const child of descendants(node)) {
      if (isIFrame(child)) dispose(child);
    }
  }
  synchronizeWindowFrameIndices();
});

function navigate(element) {
  const current = state.get(element) ?? {
    version: 0,
    handle: null,
    pendingWindow: null,
    lastWindow: null,
    facade: null,
    sameOrigin: true,
    loading: null,
    clientId: null,
  };
  const version = current.version + 1;
  const srcdoc = getAttributeValue(element, "srcdoc");
  const source = getAttributeValue(element, "src");
  let url = iframeScope().parentPageUrl;
  // 「解析不出来」与「scheme 不支持」在真实浏览器里行为**不同**，不能合并。
  //
  // 实测真实 Edge（先用 srcdoc 载入一个文档，再改 src）：
  //
  //   src="http://%"（畸形 URL）      → 派发 load，旧文档**被替换**
  //   src="nv8-unknown://x"（坏 scheme）→ **不派发任何事件**，旧文档**保留**
  //   src=""                          → 派发 load，旧文档被替换
  //
  // 迁移前两种都派发 `error` 并保留旧文档。`error` 是可检测偏差——真实浏览器
  // 的 iframe 在导航失败时从不派发 error。
  let malformedUrl = false;
  let unsupportedScheme = false;
  if (srcdoc === null && source !== null && source.trim() !== "") {
    try {
      const parsed = new URL(source, iframeScope().parentPageUrl);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        url = parsed.href;
      } else {
        unsupportedScheme = true;
      }
    } catch {
      malformedUrl = true;
    }
  }
  if (unsupportedScheme) {
    // 导航整体中止：不派发事件、不动当前文档。
    // 不推进 version——当前 Realm 保持有效。
    state.set(element, current);
    return;
  }
  if (malformedUrl) {
    // 真实浏览器提交一个错误页并派发 load。NV8 目前只做到「派发 load」，
    // 尚未替换成错误页文档（需要一份错误页 HTML 与新的子 Realm），
    // 这条差距登记在 REMAINING_TASKS。
    current.version = version;
    state.set(element, current);
    current.loading = Promise.resolve().then(() => {
      if (current.version === version) dispatch(element, "load");
    });
    return;
  }
  if (current.handle?.canNavigate?.() === false) {
    state.set(element, current);
    return;
  }
  current.version = version;
  current.handle?.close();
  current.handle = null;
  current.pendingWindow = null;
  clearFacadeFrameIndices(current.facade);
  state.set(element, current);
  const parentOrigin = new URL(iframeScope().parentPageUrl).origin;
  const childOrigin = new URL(url).origin;
  current.sameOrigin = parentOrigin === childOrigin;
  if (!current.sameOrigin && current.facade === null) {
    current.facade = createWindowFacade({
      window: () => current.handle?.window ?? current.pendingWindow,
      origin: () => childOrigin,
      parent: () => globalThis,
      top: () => globalThis.top,
      closed: () => !element.isConnected,
      postMessage(message, targetOriginOrOptions, transfer) {
        const handle = current.handle;
        if (handle === null) return;
        if (!normalizePostMessageTarget(
          targetOriginOrOptions,
          parentOrigin,
          handle.origin,
        )) return;
        handle.deliverParentMessage(
          message,
          parentOrigin,
          targetOriginOrOptions,
          transfer,
        );
      },
    });
  }
  const html = srcdoc ?? "<!doctype html><html><head></head><body></body></html>";

  const parentPostMessage = function (
    message,
    targetOriginOrOptions,
    transfer,
  ) {
    if (!normalizePostMessageTarget(
      targetOriginOrOptions,
      childOrigin,
      parentOrigin,
    )) return;
    enqueueWindowMessage(
      message,
      childOrigin,
      iframeContentWindow(element),
      transferOptions(targetOriginOrOptions, transfer),
    );
  };
  // 子 Realm 读 `parent` / `top` 时回调这里，让父 Realm 知道「现在是哪个子帧在
  // 访问我」。父 Realm 的 `windowPostMessage()` 消费一次即清。
  //
  // 挂在函数对象上而不是新加一个透传参数：`bootstrapRoot()` 已经有 40+ 个位置
  // 参数，再穿一个只会更容易漏；而这两个能力属于同一段父子关系。
  // 页面脚本拿不到这个函数（只存在子 Realm 的模块状态里），不构成可检测面。
  parentPostMessage.notifyIncumbent = () => {
    registerIncumbentSource(() => iframeContentWindow(element));
  };
  const scope = iframeScope();
  const created = scope.createChildRealm({
    pageUrl: url,
    pageHtml: html,
    navigationSource: srcdoc === null ? "src" : "srcdoc",
    // 空白 iframe（既无 src 也无 srcdoc）才能领预热池位：池位的文档就是空白骨架。
    // 带 src / srcdoc 的需要不同的文档，重建文档和新建一个 Realm 没有区别。
    blankDocument: srcdoc === null && (source === null || source.trim() === ""),
    pageReferrer: scope.parentPageUrl,
    pageContentType: "text/html",
    parentWindow: globalThis,
    topWindow: globalThis.top,
    parentOrigin,
    parentPostMessage,
    sameOrigin: current.sameOrigin,
    // 跨源时不传：子 Realm 连引用都不该拿到。规范也要求容器文档不同源时
    // `frameElement` 返回 null。
    frameElement: current.sameOrigin ? element : null,
    outerWindow: null,
    clientId: current.clientId,
    navigatePage(nextUrl) {
      return navigateClient(element, nextUrl);
    },
    onContext(window) {
      if (current.version === version) {
        current.pendingWindow = window;
        current.lastWindow = window;
      }
    },
  });

  // 命中预热池时工厂**同步**返回 handle —— 这是整个池存在的理由：
  // `document.body.appendChild(frame)` 之后 `frame.contentWindow` 必须立刻可用，
  // 反爬脚本「从干净 iframe 取原生函数」的写法是同步的。
  //
  // 但 `load` 仍然必须异步派发：真实浏览器把它排成任务，同步派发会让
  // `frame.addEventListener('load', ...)` 在注册之前就错过事件。
  if (created !== null && created !== undefined && typeof created.then !== "function") {
    current.handle = created;
    current.clientId = created.clientId ?? current.clientId;
    current.pendingWindow = created.window;
    current.lastWindow = created.window;
    current.loading = Promise.resolve().then(() => {
      if (current.version !== version || !element.isConnected) {
        created.close();
        return;
      }
      dispatch(element, "load");
      return created;
    });
    return;
  }

  current.loading = Promise.resolve(created).then(handle => {
    if (current.version !== version || !element.isConnected) {
      handle.close();
      return;
    }
    current.handle = handle;
    current.clientId = handle.clientId ?? current.clientId;
    current.pendingWindow = handle.window;
    current.lastWindow = handle.window;
    dispatch(element, "load");
    return handle;
  }, error => {
    if (current.version !== version) return;
    dispatch(element, "error");
  });
}

function navigateClient(element, value) {
  const target = new URL(`${value}`, iframeScope().parentPageUrl);
  element.removeAttribute('srcdoc');
  element.setAttribute('src', target.href);
  return state.get(element)?.loading ?? Promise.resolve(null);
}

function dispose(element) {
  const current = state.get(element);
  if (current === undefined) return;
  current.version += 1;
  current.handle?.close();
  current.handle = null;
  current.pendingWindow = null;
  current.loading = null;
  clearFacadeFrameIndices(current.facade);
}

function synchronizeWindowFrameIndices() {
  const scope = iframeScope();
  if (scope.synchronizingFrameIndices) return;
  scope.synchronizingFrameIndices = true;
  try {
    const currentDocument = globalThis.document;
    const outerWindow = currentDocument?.defaultView;
    const targets = outerWindow === null
        || outerWindow === undefined
        || outerWindow === globalThis
      ? [globalThis]
      : [globalThis, outerWindow];
    for (const name of scope.installedFrameIndices) {
      for (const target of targets) Reflect.deleteProperty(target, name);
    }
    scope.installedFrameIndices.clear();
    if (currentDocument?.getElementsByTagName === undefined) return;
    const frames = [...currentDocument.getElementsByTagName("iframe")];
    for (let index = 0; index < frames.length; index += 1) {
      const name = `${index}`;
      const getter = function () {
        return iframeContentWindow(frames[index]);
      };
      registerNativeGetter(getter, name);
      for (const target of targets) {
        Object.defineProperty(target, name, {
          get: getter,
          enumerable: true,
          configurable: true,
        });
      }
      scope.installedFrameIndices.add(name);
    }
  } finally {
    scope.synchronizingFrameIndices = false;
  }
}

function clearFacadeFrameIndices(facade) {
  if (facade === null) return;
  for (const name of Reflect.ownKeys(facade)) {
    if (
      typeof name === "string"
      && /^(?:0|[1-9]\d*)$/.test(name)
    ) {
      Reflect.deleteProperty(facade, name);
    }
  }
}

function dispatch(element, type) {
  element.dispatchEvent(new Event(type));
}

function isIFrame(value) {
  try {
    const element = requireElement(value);
    return element.namespaceURI === "http://www.w3.org/1999/xhtml"
      && element.localName === "iframe";
  } catch {
    return false;
  }
}

function requireIFrame(value) {
  if (!isIFrame(value)) throw new TypeError("Illegal invocation");
}
