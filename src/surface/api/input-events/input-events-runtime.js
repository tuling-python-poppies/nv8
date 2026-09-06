import { initializeEvent, requireEvent } from "../event/event-state.js";
import { createFileList } from "../file/file-list-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function isPointerEvent(value) {
  return state.get(value)?.kind === "pointerEvent";
}

export function UIEvent(type) {
  requireNew(new.target, "UIEvent");
  initializeUIEvent(this, type, arguments[1]);
}
export function MouseEvent(type) {
  requireNew(new.target, "MouseEvent");
  initializeMouseEvent(this, type, arguments[1]);
}
export function PointerEvent(type) {
  requireNew(new.target, "PointerEvent");
  const init = arguments[1] ?? {};
  initializeMouseEvent(this, type, init);
  Object.assign(requireRecord(this), {
    kind: "pointerEvent",
    pointerId: Number(init.pointerId ?? 0),
    width: Number(init.width ?? 1),
    height: Number(init.height ?? 1),
    pressure: Number(init.pressure ?? (init.buttons ? 0.5 : 0)),
    tiltX: Number(init.tiltX ?? 0),
    tiltY: Number(init.tiltY ?? 0),
    azimuthAngle: Number(init.azimuthAngle ?? 0),
    altitudeAngle: Number(init.altitudeAngle ?? Math.PI / 2),
    tangentialPressure: Number(init.tangentialPressure ?? 0),
    twist: Number(init.twist ?? 0),
    pointerType: `${init.pointerType ?? ""}`,
    isPrimary: Boolean(init.isPrimary),
    persistentDeviceId: Number(init.persistentDeviceId ?? 0),
    coalescedEvents: Object.freeze([...(init.coalescedEvents ?? [])]),
    predictedEvents: Object.freeze([...(init.predictedEvents ?? [])]),
  });
}
export function WheelEvent(type) {
  requireNew(new.target, "WheelEvent");
  const init = arguments[1] ?? {};
  initializeMouseEvent(this, type, init);
  const deltaX = Number(init.deltaX ?? 0);
  const deltaY = Number(init.deltaY ?? 0);
  Object.assign(requireRecord(this), {
    kind: "wheelEvent",
    deltaX,
    deltaY,
    deltaZ: Number(init.deltaZ ?? 0),
    deltaMode: Number(init.deltaMode ?? 0),
    wheelDeltaX: -deltaX * 120,
    wheelDeltaY: -deltaY * 120,
    wheelDelta: -deltaY * 120,
    momentum: false,
  });
}
export function KeyboardEvent(type) {
  requireNew(new.target, "KeyboardEvent");
  const init = arguments[1] ?? {};
  initializeUIEvent(this, type, init);
  Object.assign(requireRecord(this), {
    kind: "keyboardEvent",
    key: `${init.key ?? ""}`,
    code: `${init.code ?? ""}`,
    location: Number(init.location ?? 0),
    ...modifiers(init),
    repeat: Boolean(init.repeat),
    isComposing: Boolean(init.isComposing),
    charCode: Number(init.charCode ?? 0),
    keyCode: Number(init.keyCode ?? 0),
  });
}
export function InputEvent(type) {
  requireNew(new.target, "InputEvent");
  const init = arguments[1] ?? {};
  initializeUIEvent(this, type, init);
  Object.assign(requireRecord(this), {
    kind: "inputEvent",
    data: init.data === null ? null : `${init.data ?? ""}`,
    isComposing: Boolean(init.isComposing),
    inputType: `${init.inputType ?? ""}`,
    dataTransfer: init.dataTransfer ?? null,
    targetRanges: Object.freeze([...(init.targetRanges ?? [])]),
  });
}
export function FocusEvent(type) {
  requireNew(new.target, "FocusEvent");
  const init = arguments[1] ?? {};
  initializeUIEvent(this, type, init);
  Object.assign(requireRecord(this), {
    kind: "focusEvent",
    relatedTarget: init.relatedTarget ?? null,
  });
}
export function CompositionEvent(type) {
  requireNew(new.target, "CompositionEvent");
  const init = arguments[1] ?? {};
  initializeUIEvent(this, type, init);
  Object.assign(requireRecord(this), {
    kind: "compositionEvent",
    data: `${init.data ?? ""}`,
  });
}
export function TouchEvent(type) {
  requireNew(new.target, "TouchEvent");
  const init = arguments[1] ?? {};
  initializeUIEvent(this, type, init);
  Object.assign(requireRecord(this), {
    kind: "touchEvent",
    touches: createTouchList(init.touches),
    targetTouches: createTouchList(init.targetTouches),
    changedTouches: createTouchList(init.changedTouches),
    ...modifiers(init),
  });
}
export function TextEvent() {
  requireNew(new.target, "TextEvent");
  const init = arguments[1] ?? {};
  initializeUIEvent(this, arguments[0] ?? "", init);
  Object.assign(requireRecord(this), {
    kind: "textEvent",
    data: `${init.data ?? ""}`,
  });
}
export function DragEvent(type) {
  requireNew(new.target, "DragEvent");
  const init = arguments[1] ?? {};
  initializeMouseEvent(this, type, init);
  Object.assign(requireRecord(this), {
    kind: "dragEvent",
    dataTransfer: init.dataTransfer ?? null,
  });
}
export function Touch(init) {
  requireNew(new.target, "Touch");
  if (init === null || typeof init !== "object") {
    throw new TypeError("Touch init is required");
  }
  state.set(this, {
    kind: "touch",
    identifier: Number(init.identifier),
    target: init.target,
    screenX: Number(init.screenX ?? 0),
    screenY: Number(init.screenY ?? 0),
    clientX: Number(init.clientX ?? 0),
    clientY: Number(init.clientY ?? 0),
    pageX: Number(init.pageX ?? init.clientX ?? 0),
    pageY: Number(init.pageY ?? init.clientY ?? 0),
    radiusX: Number(init.radiusX ?? 0),
    radiusY: Number(init.radiusY ?? 0),
    rotationAngle: Number(init.rotationAngle ?? 0),
    force: Number(init.force ?? 0),
  });
}
export function TouchList() { illegalConstructor("TouchList", new.target); }
export function InputDeviceCapabilities() {
  requireNew(new.target, "InputDeviceCapabilities");
  const init = arguments[0] ?? {};
  state.set(this, {
    kind: "inputCapabilities",
    firesTouchEvents: Boolean(init.firesTouchEvents),
  });
}
export function DataTransfer() {
  requireNew(new.target, "DataTransfer");
  const items = createDataTransferItemList();
  state.set(this, {
    kind: "dataTransfer",
    dropEffect: "none",
    effectAllowed: "uninitialized",
    items,
    dragImage: null,
  });
}
export function DataTransferItem() { illegalConstructor("DataTransferItem", new.target); }
export function DataTransferItemList() { illegalConstructor("DataTransferItemList", new.target); }
export function ClipboardEvent(type) {
  requireNew(new.target, "ClipboardEvent");
  const init = arguments[1] ?? {};
  initializeEvent(this, `${type}`, eventInit(init));
  state.set(this, {
    kind: "clipboardEvent",
    clipboardData: init.clipboardData ?? null,
  });
}

export const inputEventConstructors = Object.freeze([
  UIEvent, MouseEvent, PointerEvent, WheelEvent, KeyboardEvent, InputEvent,
  FocusEvent, CompositionEvent, TouchEvent, TextEvent, DragEvent, Touch,
  TouchList, InputDeviceCapabilities, DataTransfer, DataTransferItem,
  DataTransferItemList, ClipboardEvent,
]);
for (const Constructor of inputEventConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function inputEventProperty(value, name) {
  const record = requireRecord(value);
  if (record.kind === "dataTransferItem" && name === "kind") {
    return record.kindValue;
  }
  if (record.kind === "touchList" && name === "length") return record.values.length;
  if (record.kind === "dataTransferItemList" && name === "length") {
    return record.values.length;
  }
  if (record.kind === "dataTransfer" && name === "types") {
    return Object.freeze(record.items === undefined ? [] : itemTypes(record.items));
  }
  if (record.kind === "dataTransfer" && name === "files") {
    return createFileList(itemFiles(record.items));
  }
  return record[name];
}

export function setInputEventProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.kind === "dataTransfer" && name === "dropEffect") {
    if (["none", "copy", "link", "move"].includes(`${input}`)) {
      record.dropEffect = `${input}`;
    }
  }
  if (record.kind === "dataTransfer" && name === "effectAllowed") {
    record.effectAllowed = `${input}`;
  }
}

export function inputEventOperation(value, name, args) {
  const record = requireRecord(value);
  if (name === "getModifierState") return modifierState(record, args[0]);
  if (name.startsWith("init")) return legacyInit(value, record, name, args);
  if (record.kind === "pointerEvent") {
    if (name === "getCoalescedEvents") return [...record.coalescedEvents];
    if (name === "getPredictedEvents") return [...record.predictedEvents];
  }
  if (record.kind === "inputEvent" && name === "getTargetRanges") {
    return [...record.targetRanges];
  }
  if (record.kind === "touchList" && name === "item") {
    return record.values[Number(args[0]) >>> 0] ?? null;
  }
  if (record.kind === "dataTransfer") {
    return dataTransferOperation(record, name, args);
  }
  if (record.kind === "dataTransferItemList") {
    return itemListOperation(record, value, name, args);
  }
  if (record.kind === "dataTransferItem") {
    return itemOperation(record, name, args);
  }
  throw new TypeError(`Unsupported input-event operation: ${name}`);
}

export function inputEventIterator(value) {
  const record = requireRecord(value);
  return record.values.values();
}

function initializeUIEvent(value, type, init = {}) {
  initializeEvent(value, `${type}`, eventInit(init));
  state.set(value, {
    kind: "uiEvent",
    view: init.view ?? null,
    detail: Number(init.detail ?? 0),
    sourceCapabilities: init.sourceCapabilities ?? null,
    which: Number(init.which ?? 0),
    pseudoTarget: null,
  });
}

function initializeMouseEvent(value, type, init = {}) {
  initializeUIEvent(value, type, init);
  const clientX = Number(init.clientX ?? 0);
  const clientY = Number(init.clientY ?? 0);
  Object.assign(requireRecord(value), {
    kind: "mouseEvent",
    screenX: Number(init.screenX ?? 0),
    screenY: Number(init.screenY ?? 0),
    clientX,
    clientY,
    ...modifiers(init),
    button: Number(init.button ?? 0),
    buttons: Number(init.buttons ?? 0),
    relatedTarget: init.relatedTarget ?? null,
    pageX: Number(init.pageX ?? clientX),
    pageY: Number(init.pageY ?? clientY),
    x: clientX,
    y: clientY,
    offsetX: Number(init.offsetX ?? clientX),
    offsetY: Number(init.offsetY ?? clientY),
    movementX: Number(init.movementX ?? 0),
    movementY: Number(init.movementY ?? 0),
    fromElement: null,
    toElement: init.relatedTarget ?? null,
    layerX: clientX,
    layerY: clientY,
  });
}

function dataTransferOperation(record, name, args) {
  const list = requireRecord(record.items);
  if (name === "clearData") {
    const type = args[0] === undefined ? null : `${args[0]}`.toLowerCase();
    list.values = type === null
      ? list.values.filter(item => requireRecord(item).kindValue === "file")
      : list.values.filter(item => requireRecord(item).type !== type);
    syncIndices(record.items, list);
    return;
  }
  if (name === "getData") {
    const type = `${args[0]}`.toLowerCase();
    const item = list.values.find(value => requireRecord(value).type === type);
    return item === undefined ? "" : `${requireRecord(item).data}`;
  }
  if (name === "setData") {
    const type = `${args[0]}`.toLowerCase();
    const data = `${args[1]}`;
    const existing = list.values.find(value => requireRecord(value).type === type);
    if (existing === undefined) list.values.push(createDataTransferItem(data, type));
    else requireRecord(existing).data = data;
    syncIndices(record.items, list);
    return;
  }
  if (name === "setDragImage") {
    record.dragImage = {
      image: args[0],
      x: Number(args[1]),
      y: Number(args[2]),
    };
  }
}

function itemListOperation(record, object, name, args) {
  if (name === "clear") {
    record.values.length = 0;
    syncIndices(object, record);
    return;
  }
  if (name === "remove") {
    record.values.splice(Number(args[0]) >>> 0, 1);
    syncIndices(object, record);
    return;
  }
  if (name === "add") {
    const data = args[0];
    const type = args[1] ?? (data instanceof File ? data.type : "text/plain");
    const item = createDataTransferItem(data, type);
    record.values.push(item);
    syncIndices(object, record);
    return item;
  }
}

function itemOperation(record, name, args) {
  if (name === "getAsFile") return record.kindValue === "file" ? record.data : null;
  if (name === "getAsString") {
    if (record.kindValue !== "string") return;
    const callback = args[0];
    if (typeof callback === "function") {
      Promise.resolve().then(() => Reflect.apply(callback, undefined, [`${record.data}`]));
    }
    return;
  }
  if (name === "getAsFileSystemHandle") return Promise.resolve(null);
  if (name === "webkitGetAsEntry") return null;
}

function createDataTransferItem(data, type) {
  const value = Object.create(DataTransferItem.prototype);
  state.set(value, {
    kind: "dataTransferItem",
    kindValue: data instanceof File ? "file" : "string",
    type: `${type ?? ""}`.toLowerCase(),
    data,
  });
  return value;
}

function createDataTransferItemList() {
  const value = Object.create(DataTransferItemList.prototype);
  state.set(value, { kind: "dataTransferItemList", values: [], indexedLength: 0 });
  return value;
}

function createTouchList(input = []) {
  const value = Object.create(TouchList.prototype);
  const values = Object.freeze([...input]);
  state.set(value, { kind: "touchList", values, indexedLength: 0 });
  syncIndices(value, state.get(value));
  return value;
}

function syncIndices(object, record) {
  for (let index = 0; index < record.indexedLength; index += 1) delete object[index];
  record.values.forEach((value, index) => {
    Object.defineProperty(object, index, {
      value,
      enumerable: true,
      configurable: true,
    });
  });
  record.indexedLength = record.values.length;
}

function itemTypes(items) {
  return [...new Set(requireRecord(items).values.map(item => requireRecord(item).type))];
}

function itemFiles(items) {
  return requireRecord(items).values
    .filter(item => requireRecord(item).kindValue === "file")
    .map(item => requireRecord(item).data);
}

function modifierState(record, key) {
  const normalized = `${key}`.toLowerCase();
  return {
    alt: record.altKey,
    altgraph: false,
    capslock: false,
    control: record.ctrlKey,
    meta: record.metaKey,
    numlock: false,
    scrolllock: false,
    shift: record.shiftKey,
  }[normalized] ?? false;
}

function legacyInit(value, record, name, args) {
  const event = requireEvent(value);
  event.type = `${args[0]}`;
  record.view = args[1] ?? null;
  record.detail = Number(args[2] ?? 0);
  if (name === "initCompositionEvent" || name === "initTextEvent") {
    record.data = `${args.at(-1) ?? ""}`;
  }
}

function modifiers(init) {
  return {
    ctrlKey: Boolean(init.ctrlKey),
    shiftKey: Boolean(init.shiftKey),
    altKey: Boolean(init.altKey),
    metaKey: Boolean(init.metaKey),
  };
}

function eventInit(init) {
  return {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  };
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use new`);
  }
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
