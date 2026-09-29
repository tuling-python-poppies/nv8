import { markEventTrusted } from "./event-state.js";

/**
 * 宿主可信输入派发（`sandbox.dispatchTrustedInput(type, init)`）。
 *
 * 真实 Edge 里只有用户/宿主产生的输入事件 `isTrusted === true`。NV8 作为宿主
 * 提供同地位入口：事件由本模块在 Realm 内构造并标记 `isTrusted`，再沿正常
 * 事件路径派发（目标取 `document.activeElement`，从而冒泡到 window）。
 *
 * 只接受真正的用户输入事件类型；`error` / `custom-event` 这类非输入类型一律
 * 拒绝——把信任位借给任意事件类型等于让页面能伪造宿主信号。
 */
const MOUSE_INPUTS = new Map([
  ["click", { detail: 1, buttons: 0 }],
  ["dblclick", { detail: 2, buttons: 0 }],
  ["mousedown", { detail: 1, buttons: 1 }],
  ["mouseup", { detail: 1, buttons: 0 }],
  ["mousemove", { detail: 0, buttons: 0 }],
]);
const KEY_INPUTS = new Set(["keydown", "keyup"]);
const PLAIN_INPUTS = new Set(["input", "change"]);

export function isSupportedTrustedInput(type) {
  return MOUSE_INPUTS.has(type) || KEY_INPUTS.has(type) || PLAIN_INPUTS.has(type);
}

export function dispatchTrustedInputEvent(type, init = {}) {
  const name = `${type}`;
  if (!isSupportedTrustedInput(name)) {
    throw new TypeError(
      `Failed to dispatch trusted input: unsupported input type "${name}"`,
    );
  }
  const event = createInputEvent(name, init ?? {});
  markEventTrusted(event);
  return inputTarget().dispatchEvent(event);
}

function createInputEvent(name, init) {
  const mouse = MOUSE_INPUTS.get(name);
  if (mouse !== undefined) {
    const Constructor = typeof globalThis.PointerEvent === "function"
      ? globalThis.PointerEvent
      : globalThis.MouseEvent;
    return new Constructor(name, {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: globalThis,
      detail: mouse.detail,
      button: 0,
      buttons: mouse.buttons,
      clientX: finiteNumber(init.clientX, 0),
      clientY: finiteNumber(init.clientY, 0),
      screenX: finiteNumber(init.screenX, 0),
      screenY: finiteNumber(init.screenY, 0),
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
    });
  }
  if (KEY_INPUTS.has(name)) {
    return new globalThis.KeyboardEvent(name, {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: globalThis,
      key: `${init.key ?? ""}`,
      code: `${init.code ?? ""}`,
      location: 0,
      repeat: Boolean(init.repeat),
      isComposing: false,
      ctrlKey: Boolean(init.ctrlKey),
      shiftKey: Boolean(init.shiftKey),
      altKey: Boolean(init.altKey),
      metaKey: Boolean(init.metaKey),
    });
  }
  return new globalThis.Event(name, {
    bubbles: true,
    cancelable: true,
    composed: true,
  });
}

function inputTarget() {
  const currentDocument = globalThis.document;
  if (currentDocument === undefined) return globalThis;
  return currentDocument.activeElement
    ?? currentDocument.body
    ?? currentDocument;
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
