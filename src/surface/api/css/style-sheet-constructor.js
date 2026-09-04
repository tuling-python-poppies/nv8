import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function StyleSheet() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(StyleSheet, "StyleSheet");

export function installStyleSheetConstructor() {
  delete StyleSheet.prototype.constructor;
  defineGlobalConstructor("StyleSheet", StyleSheet);
}
