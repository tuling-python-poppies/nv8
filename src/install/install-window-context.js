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
