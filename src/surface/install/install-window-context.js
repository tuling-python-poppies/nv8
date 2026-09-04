import { configureDocumentDefaultView } from '../api/dom/document-default-view-state.js';
import {
  configureWindowMessaging,
  receiveParentWindowMessage,
  windowParent,
  windowTop,
} from '../api/window/window-messaging.js';

export function installWindowContext(options = {}) {
  configureWindowMessaging(
    options.origin ?? 'null',
    options.parentWindow ?? null,
    options.topWindow ?? null,
    options.parentOrigin ?? '',
    options.parentPostMessage ?? null,
    options.sameOrigin === true,
  );
  // 这里刻意**不**配置 `frameElement`：plugin 模式的 Window 表面里压根没有这个
  // 访问器（它由 legacy 的 `installWindowStateGlobals()` 安装，实测 plugin 档
  // 的 surface fixture 里 `frameElement` 是 ABSENT）。加一个必然无效的配置调用
  // 就是「看起来可配置但实际不可配置」，比没有更容易误导。
  // plugin 表面哪天把它装上，配置调用应当和访问器一起加。
  configureDocumentDefaultView(globalThis);
  Object.defineProperties(globalThis, {
    window: {
      value: globalThis,
      writable: true,
      enumerable: true,
      configurable: true,
    },
    parent: {
      get: windowParent,
      enumerable: true,
      configurable: true,
    },
    top: {
      get: windowTop,
      enumerable: true,
      configurable: true,
    },
  });
}

export function receiveWindowContextMessage(
  message,
  origin,
  targetOriginOrOptions,
  transfer,
) {
  receiveParentWindowMessage(
    message,
    origin,
    targetOriginOrOptions,
    transfer,
  );
}
