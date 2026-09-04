import { requireOffscreenCanvas } from "../canvas/offscreen-canvas-state.js";
import { requireElement } from "../dom/element-state.js";
import { DOMException } from "../event/dom-exception-constructor.js";
import { Event } from "../event/event-constructor.js";
import { dispatchEvent } from "../event/event-target-dispatch-event.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { isPointerEvent } from "../input-events/input-events-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function CloseWatcher() {
  if (new.target === undefined) {
    throw new TypeError("CloseWatcher requires new");
  }
  initializeEventTarget(this);
  state.set(this, {
    kind: "watcher",
    oncancel: null,
    onclose: null,
    active: true,
  });
}

export function EyeDropper() {
  if (new.target === undefined) {
    throw new TypeError("constructor must be called with new");
  }
  state.set(this, { kind: "eyeDropper" });
}

export function Ink() {
  throw new TypeError("Failed to construct 'Ink': Illegal constructor");
}

export function DelegatedInkTrailPresenter() {
  throw new TypeError(
    "Failed to construct 'DelegatedInkTrailPresenter': Illegal constructor",
  );
}

export const userInteractionConstructors = Object.freeze([
  CloseWatcher,
  EyeDropper,
  Ink,
  DelegatedInkTrailPresenter,
]);
for (const Constructor of userInteractionConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createInk() {
  return create(Ink, { kind: "ink" });
}

export function userInteractionProperty(value, name) {
  return requireRecord(value)[name];
}

export function setUserInteractionProperty(value, name, input) {
  const record = requireRecord(value);
  if (
    record.kind !== "watcher"
    || !["oncancel", "onclose"].includes(name)
  ) {
    throw new TypeError("Illegal invocation");
  }
  record[name] = typeof input === "function" ? input : null;
}

export function userInteractionOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "watcher") {
    if (name === "close") return fireClose(value, record);
    if (name === "destroy") {
      record.active = false;
      return undefined;
    }
    if (name === "requestClose") {
      if (!record.active) return undefined;
      const event = new Event("cancel", { cancelable: true });
      const allowed = Reflect.apply(dispatchEvent, value, [event]);
      Reflect.apply(record.oncancel ?? noop, value, [event]);
      if (allowed && !event.defaultPrevented) fireClose(value, record);
      return undefined;
    }
  }
  if (record.kind === "eyeDropper" && name === "open") {
    return Promise.resolve({ sRGBHex: "#000000" });
  }
  if (record.kind === "ink" && name === "requestPresenter") {
    const area = args[0]?.presentationArea ?? null;
    if (area !== null && !isPresentationArea(area)) {
      throw new TypeError("presentationArea must be an Element");
    }
    return Promise.resolve(create(DelegatedInkTrailPresenter, {
      kind: "presenter",
      presentationArea: area,
    }));
  }
  if (
    record.kind === "presenter"
    && name === "updateInkTrailStartPoint"
  ) {
    if (args.length < 2) {
      throw new TypeError(
        "Failed to execute 'updateInkTrailStartPoint': "
          + "2 arguments required",
      );
    }
    if (!isPointerEvent(args[0])) {
      throw new TypeError("parameter 1 is not of type 'PointerEvent'");
    }
    if (
      args[1] !== null
      && args[1] !== undefined
      && typeof args[1] !== "object"
    ) {
      throw new TypeError(
        "The provided value is not of type 'InkTrailStyle'",
      );
    }
    throw new DOMException(
      "Only trusted pointerevents are accepted.",
      "NotAllowedError",
    );
  }
  throw new TypeError(`Unsupported user interaction operation: ${name}`);
}

function fireClose(value, record) {
  if (!record.active) return undefined;
  const event = new Event("close");
  Reflect.apply(dispatchEvent, value, [event]);
  Reflect.apply(record.onclose ?? noop, value, [event]);
  record.active = false;
  return undefined;
}

function isPresentationArea(value) {
  try {
    requireElement(value);
    return true;
  } catch {
    try {
      requireOffscreenCanvas(value);
      return true;
    } catch {
      return false;
    }
  }
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function noop() {}
