import { DOMException } from "../event/dom-exception-constructor.js";
import { createBlob } from "../file/blob-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function FontFace(family, source) {
  if (new.target === undefined || arguments.length < 2) {
    throw new TypeError(
      "Failed to construct 'FontFace': 2 arguments required",
    );
  }
  const normalizedFamily = `${family}`;
  if (normalizedFamily.trim().length === 0) {
    throw new DOMException("The font family is empty", "SyntaxError");
  }
  const descriptors = arguments[2] !== null
    && typeof arguments[2] === "object"
    ? arguments[2]
    : {};
  const binarySource = source instanceof ArrayBuffer
    || ArrayBuffer.isView(source);
  let resolveLoaded;
  const loaded = new Promise(resolve => {
    resolveLoaded = resolve;
  });
  const record = {
    kind: "face",
    family: normalizedFamily,
    style: option(descriptors, "style", "normal"),
    weight: option(descriptors, "weight", "normal"),
    stretch: option(descriptors, "stretch", "normal"),
    unicodeRange: option(descriptors, "unicodeRange", "U+0-10FFFF"),
    variant: option(descriptors, "variant", "normal"),
    featureSettings: option(descriptors, "featureSettings", "normal"),
    display: option(descriptors, "display", "auto"),
    ascentOverride: option(descriptors, "ascentOverride", "normal"),
    descentOverride: option(descriptors, "descentOverride", "normal"),
    lineGapOverride: option(descriptors, "lineGapOverride", "normal"),
    sizeAdjust: option(descriptors, "sizeAdjust", "100%"),
    variationSettings: option(descriptors, "variationSettings", "normal"),
    status: binarySource ? "loaded" : "unloaded",
    loaded,
    resolveLoaded,
  };
  state.set(this, record);
  if (binarySource) resolveLoaded(this);
}

export function FontData() {
  throw new TypeError("Illegal constructor");
}

registerNativeFunction(FontFace, "FontFace");
registerNativeFunction(FontData, "FontData");
export const localFontsConstructors = Object.freeze([FontFace, FontData]);

export function queryLocalFonts() {
  return Promise.resolve([
    create(FontData, {
      kind: "data",
      postscriptName: "EdgeSandboxSans-Regular",
      fullName: "Edge Sandbox Sans Regular",
      family: "Edge Sandbox Sans",
      style: "Regular",
      bytes: new Uint8Array(),
    }),
  ]);
}
registerNativeFunction(queryLocalFonts, "queryLocalFonts");

export function localFontsProperty(value, name) {
  return requireRecord(value)[name];
}

export function setLocalFontsProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.kind !== "face" || !fontFaceSettable.has(name)) {
    throw new TypeError("Illegal invocation");
  }
  record[name] = `${input}`;
}

export function localFontsOperation(value, name) {
  const record = requireRecord(value);
  if (record.kind === "face" && name === "load") {
    if (record.status !== "loaded") {
      record.status = "loaded";
      record.resolveLoaded(value);
    }
    return record.loaded;
  }
  if (record.kind === "data" && name === "blob") {
    return Promise.resolve(createBlob(record.bytes.slice(), "font/ttf"));
  }
  throw new TypeError(`Unsupported local fonts operation: ${name}`);
}

export const fontFaceSettable = new Set([
  "family",
  "style",
  "weight",
  "stretch",
  "unicodeRange",
  "variant",
  "featureSettings",
  "display",
  "ascentOverride",
  "descentOverride",
  "lineGapOverride",
  "sizeAdjust",
  "variationSettings",
]);

function option(value, name, fallback) {
  return value[name] === undefined ? fallback : `${value[name]}`;
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
