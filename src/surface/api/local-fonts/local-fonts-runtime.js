import { DOMException } from "../event/dom-exception-constructor.js";
import { createBlob } from "../file/blob-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const profile = createRealmSlot(() => 150, "local-fonts-version");
export function configureLocalFontsVersion(browserMajorVersion) {
  profile.set(globalThis, browserMajorVersion);
}

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
  let rejectLoaded;
  const loaded = new Promise((resolve, reject) => {
    resolveLoaded = resolve;
    rejectLoaded = reject;
  });
  const edge154Surface = profile.get(globalThis) >= 154;
  const widthInput = edge154Surface && descriptors.width !== undefined
    ? `${descriptors.width}` : option(descriptors, "stretch", "normal");
  const width = edge154Surface ? normalizeFontWidth(widthInput) : widthInput;
  const record = {
    kind: "face",
    family: normalizedFamily,
    style: option(descriptors, "style", "normal"),
    weight: option(descriptors, "weight", "normal"),
    stretch: width ?? "normal",
    unicodeRange: option(descriptors, "unicodeRange", "U+0-10FFFF"),
    variant: option(descriptors, "variant", "normal"),
    featureSettings: option(descriptors, "featureSettings", "normal"),
    display: option(descriptors, "display", "auto"),
    ascentOverride: option(descriptors, "ascentOverride", "normal"),
    descentOverride: option(descriptors, "descentOverride", "normal"),
    lineGapOverride: option(descriptors, "lineGapOverride", "normal"),
    sizeAdjust: option(descriptors, "sizeAdjust", "100%"),
    variationSettings: option(descriptors, "variationSettings", "normal"),
    status: width === null ? "error" : binarySource ? "loaded" : "unloaded",
    loaded,
    resolveLoaded,
  };
  state.set(this, record);
  if (width === null) {
    loaded.catch(() => {});
    rejectLoaded(new DOMException(`Failed to set '${widthInput}' as a property value.`, "SyntaxError"));
  } else if (binarySource) resolveLoaded(this);
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
  return requireRecord(value)[name === "width" ? "stretch" : name];
}

export function setLocalFontsProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.kind !== "face" || !fontFaceSettable.has(name)) {
    throw new TypeError("Illegal invocation");
  }
  const text = `${input}`;
  if (profile.get(globalThis) >= 154 && (name === "width" || name === "stretch")) {
    const normalized = normalizeFontWidth(text);
    if (normalized === null) {
      throw new DOMException(
        `Failed to set the '${name}' property on 'FontFace': Failed to set '${text}' as a property value.`,
        "SyntaxError",
      );
    }
    record.stretch = normalized;
  } else {
    record[name] = text;
  }
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
  "width",
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

const widthKeywords = new Set([
  "normal", "ultra-condensed", "extra-condensed", "condensed", "semi-condensed",
  "semi-expanded", "expanded", "extra-expanded", "ultra-expanded",
]);

function normalizeFontWidth(input) {
  const text = input.trim().toLowerCase();
  if (widthKeywords.has(text)) return text;
  const values = text.split(/\s+/u);
  // ponytail: CSS math functions need a shared CSS numeric parser before width can accept them.
  if (values.length > 2 || !values.every(value => (
    /^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?%$/u.test(value)
    && Number.isFinite(Number(value.slice(0, -1))) && Number(value.slice(0, -1)) >= 0
  ))) return null;
  return values.map(value => `${Number(value.slice(0, -1))}%`).join(" ");
}

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
