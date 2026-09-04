import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { StylePropertyMapReadOnly } from "./style-property-map-read-only-constructor.js";

export function StylePropertyMap() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(StylePropertyMap, "StylePropertyMap");

export function installStylePropertyMapConstructor() {
  Object.setPrototypeOf(StylePropertyMap.prototype, StylePropertyMapReadOnly.prototype);
  Object.setPrototypeOf(StylePropertyMap, StylePropertyMapReadOnly);
  delete StylePropertyMap.prototype.constructor;
  defineGlobalConstructor("StylePropertyMap", StylePropertyMap);
}
