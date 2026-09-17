import { initializeEventTarget } from "../event/event-target-state.js";
import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
let crashReportSingleton = null;
let documentPictureInPictureSingleton = null;
let viewportValue;

export function CrashReportContext() {
  throw new TypeError(
    "Failed to construct 'CrashReportContext': Illegal constructor",
  );
}

export function DocumentPictureInPicture() {
  throw new TypeError(
    "Failed to construct 'DocumentPictureInPicture': Illegal constructor",
  );
}

export function Fence() {
  throw new TypeError("Failed to construct 'Fence': Illegal constructor");
}

export function Viewport() {
  throw new TypeError("Failed to construct 'Viewport': Illegal constructor");
}

registerNativeFunction(CrashReportContext, "CrashReportContext");
registerNativeFunction(
  DocumentPictureInPicture,
  "DocumentPictureInPicture",
);
registerNativeFunction(Fence, "Fence");
registerNativeFunction(Viewport, "Viewport");

export const globalServiceConstructors = Object.freeze([
  CrashReportContext,
  DocumentPictureInPicture,
  Fence,
  Viewport,
]);

export function resetGlobalServices() {
  crashReportSingleton = create(CrashReportContext, {
    kind: "crash-report",
    initialized: false,
    productName: "",
    companyName: "",
    submitURL: "",
    annotations: new Map(),
  });
  documentPictureInPictureSingleton = create(
    DocumentPictureInPicture,
    {
      kind: "document-picture-in-picture",
      window: null,
      onenter: null,
    },
  );
  initializeEventTarget(documentPictureInPictureSingleton);
  viewportValue = create(Viewport, { kind: "viewport" });
}

export function crashReportGlobal() {
  return crashReportSingleton;
}

export function documentPictureInPictureGlobal() {
  return documentPictureInPictureSingleton;
}

export function viewportGlobal() {
  return viewportValue;
}

export function setViewportGlobal(value) {
  viewportValue = value;
}

export function globalServiceProperty(value, name) {
  const record = requireRecord(value);
  if (record.kind === "document-picture-in-picture") {
    if (name === "window" || name === "onenter") return record[name];
  }
  if (record.kind === "viewport" && name === "segments") {
    const width = Number(globalThis.innerWidth ?? globalThis.screen?.width ?? 0);
    const height = Number(
      globalThis.innerHeight ?? globalThis.screen?.height ?? 0,
    );
    return [createDOMRect(0, 0, width, height)];
  }
  throw new TypeError("Illegal invocation");
}

export function setGlobalServiceProperty(value, name, input) {
  const record = requireRecord(value);
  if (
    record.kind !== "document-picture-in-picture"
    || name !== "onenter"
  ) {
    throw new TypeError("Illegal invocation");
  }
  record.onenter = typeof input === "function" ? input : null;
}

export function globalServiceOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "crash-report") {
    return crashReportOperation(record, name, args);
  }
  if (record.kind === "document-picture-in-picture") {
    if (name !== "requestWindow") throw new TypeError("Illegal invocation");
    return Promise.reject(new DOMException(
      "Document Picture-in-Picture requires transient user activation.",
      "NotAllowedError",
    ));
  }
  if (record.kind === "fence") {
    return fenceOperation(record, name, args);
  }
  throw new TypeError("Illegal invocation");
}

function crashReportOperation(record, name, args) {
  if (name === "initialize") {
    requireArguments("initialize", "CrashReportContext", args, 1);
    const options = args[0];
    if (
      (typeof options !== "object" || options === null)
      && typeof options !== "function"
    ) {
      throw new TypeError("CrashReportContext options must be an object");
    }
    record.initialized = true;
    record.productName = stringProperty(options, "productName");
    record.companyName = stringProperty(options, "companyName");
    record.submitURL = stringProperty(options, "submitURL");
    return Promise.resolve();
  }
  if (name === "set") {
    requireArguments("set", "CrashReportContext", args, 2);
    requireCrashReportInitialized(record);
    record.annotations.set(`${args[0]}`, `${args[1]}`);
    return undefined;
  }
  if (name === "delete") {
    requireArguments("delete", "CrashReportContext", args, 1);
    requireCrashReportInitialized(record);
    record.annotations.delete(`${args[0]}`);
    return undefined;
  }
  throw new TypeError("Illegal invocation");
}

function fenceOperation(record, name, args) {
  if (name === "getNestedConfigs") return [...record.nestedConfigs];
  if (
    name !== "reportEvent"
    && name !== "setReportEventDataForAutomaticBeacons"
  ) {
    throw new TypeError("Illegal invocation");
  }
  if (args.length === 0) {
    throw new TypeError("Fence reporting requires one event data argument.");
  }
  const data = args[0];
  if (
    (typeof data !== "object" || data === null)
    && typeof data !== "function"
  ) {
    throw new TypeError("Fence event data must be an object");
  }
  const dictionary = Object.fromEntries(
    Reflect.ownKeys(data)
      .filter(key => typeof key === "string")
      .map(key => [key, `${data[key]}`]),
  );
  if (name === "reportEvent") record.reports.push(dictionary);
  else record.automaticBeacon = dictionary;
  return undefined;
}

function requireArguments(method, interfaceName, args, count) {
  if (args.length >= count) return;
  throw new TypeError(
    `Failed to execute '${method}' on '${interfaceName}': `
      + `${count} argument${count === 1 ? "" : "s"} required, but only `
      + `${args.length} present.`,
  );
}

function requireCrashReportInitialized(record) {
  if (record.initialized) return;
  throw new DOMException(
    "CrashReportContext is not initialized. "
      + "Call initialize() and wait for it to resolve.",
    "InvalidStateError",
  );
}

function stringProperty(value, name) {
  return value[name] === undefined ? "" : `${value[name]}`;
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
