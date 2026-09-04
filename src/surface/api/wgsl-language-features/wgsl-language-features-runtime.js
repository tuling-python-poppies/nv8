import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
const features = Object.freeze([
  "readonly_and_readwrite_storage_textures",
  "packed_4x8_integer_dot_product",
]);

export function WGSLLanguageFeatures() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(WGSLLanguageFeatures, "WGSLLanguageFeatures");

export function createWGSLLanguageFeatures() {
  const value = Object.create(WGSLLanguageFeatures.prototype);
  state.set(value, new Set(features));
  return value;
}

export function wgslLanguageFeaturesProperty(value, name) {
  const record = requireRecord(value);
  if (name !== "size") throw new TypeError("Illegal invocation");
  return record.size;
}

export function wgslLanguageFeaturesOperation(value, name, args) {
  const record = requireRecord(value);
  if (name === "has") return record.has(`${args[0]}`);
  if (name === "entries") return record.entries();
  if (name === "keys" || name === "values") return record.values();
  if (name === "forEach") {
    if (typeof args[0] !== "function") {
      throw new TypeError("callback is not callable");
    }
    for (const feature of record) {
      Reflect.apply(args[0], args[1], [feature, feature, value]);
    }
    return undefined;
  }
  throw new TypeError("Illegal invocation");
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
