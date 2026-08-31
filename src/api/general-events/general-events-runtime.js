import { initializeEvent, requireEvent } from "../event/event-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function ProgressEvent(type) {
  initialize(this, new.target, "ProgressEvent", type, arguments[1], {
    lengthComputable: Boolean(arguments[1]?.lengthComputable),
    loaded: Number(arguments[1]?.loaded ?? 0),
    total: Number(arguments[1]?.total ?? 0),
  });
}
export function ErrorEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "ErrorEvent", type, init, {
    message: `${init.message ?? ""}`,
    filename: `${init.filename ?? ""}`,
    lineno: Number(init.lineno ?? 0),
    colno: Number(init.colno ?? 0),
    error: init.error ?? null,
  });
}
export function CloseEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "CloseEvent", type, init, {
    wasClean: Boolean(init.wasClean),
    code: Number(init.code ?? 0),
    reason: `${init.reason ?? ""}`,
  });
}
export function PromiseRejectionEvent(type, init) {
  if (init === null || typeof init !== "object" || !("promise" in init)) {
    throw new TypeError("PromiseRejectionEvent init is required");
  }
  initialize(this, new.target, "PromiseRejectionEvent", type, init, {
    promise: init.promise,
    reason: init.reason,
  });
}
export function PopStateEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "PopStateEvent", type, init, {
    state: clone(init.state ?? null),
    hasUAVisualTransition: Boolean(init.hasUAVisualTransition),
  });
}
export function HashChangeEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "HashChangeEvent", type, init, {
    oldURL: `${init.oldURL ?? ""}`,
    newURL: `${init.newURL ?? ""}`,
  });
}
export function StorageEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "StorageEvent", type, init, storageFields(init));
}
export function PageTransitionEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "PageTransitionEvent", type, init, {
    persisted: Boolean(init.persisted),
  });
}
export function SubmitEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "SubmitEvent", type, init, {
    submitter: init.submitter ?? null,
  });
}
export function ToggleEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "ToggleEvent", type, init, {
    oldState: `${init.oldState ?? "closed"}`,
    newState: `${init.newState ?? "closed"}`,
    source: init.source ?? null,
  });
}
export function FormDataEvent(type, init) {
  if (init === null || typeof init !== "object" || !("formData" in init)) {
    throw new TypeError("FormDataEvent init is required");
  }
  initialize(this, new.target, "FormDataEvent", type, init, {
    formData: init.formData,
  });
}
export function TrackEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "TrackEvent", type, init, {
    track: init.track ?? null,
  });
}
export function MediaQueryListEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "MediaQueryListEvent", type, init, {
    media: `${init.media ?? ""}`,
    matches: Boolean(init.matches),
  });
}
export function AnimationEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "AnimationEvent", type, init, {
    animationName: `${init.animationName ?? ""}`,
    elapsedTime: Number(init.elapsedTime ?? 0),
    pseudoElement: `${init.pseudoElement ?? ""}`,
    pseudoTarget: null,
    animation: null,
  });
}
export function TransitionEvent(type) {
  const init = arguments[1] ?? {};
  initialize(this, new.target, "TransitionEvent", type, init, {
    propertyName: `${init.propertyName ?? ""}`,
    elapsedTime: Number(init.elapsedTime ?? 0),
    pseudoElement: `${init.pseudoElement ?? ""}`,
    pseudoTarget: null,
    animation: null,
  });
}

export const generalEventConstructors = Object.freeze([
  ProgressEvent, ErrorEvent, CloseEvent, PromiseRejectionEvent, PopStateEvent,
  HashChangeEvent, StorageEvent, PageTransitionEvent, SubmitEvent, ToggleEvent,
  FormDataEvent, TrackEvent, MediaQueryListEvent, AnimationEvent,
  TransitionEvent,
]);
for (const Constructor of generalEventConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function generalEventProperty(value, name) {
  return requireRecord(value)[name];
}

export function generalEventOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "StorageEvent" && name === "initStorageEvent") {
    requireEvent(value).type = `${args[0]}`;
    Object.assign(record, storageFields({
      key: args[1],
      oldValue: args[2],
      newValue: args[3],
      url: args[4],
      storageArea: args[5],
    }));
    return;
  }
  throw new TypeError(`Unsupported general event operation: ${name}`);
}

function initialize(value, newTarget, kind, type, init = {}, fields) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${kind}': use new`);
  }
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, { kind, ...fields });
}

function storageFields(init) {
  return {
    key: init.key === null || init.key === undefined ? null : `${init.key}`,
    oldValue: init.oldValue === null || init.oldValue === undefined
      ? null
      : `${init.oldValue}`,
    newValue: init.newValue === null || init.newValue === undefined
      ? null
      : `${init.newValue}`,
    url: `${init.url ?? ""}`,
    storageArea: init.storageArea ?? null,
  };
}

function clone(value) {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
