import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function StyleSheetList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(StyleSheetList, "StyleSheetList");

export function installStyleSheetListConstructor() {
  delete StyleSheetList.prototype.constructor;
  defineGlobalConstructor("StyleSheetList", StyleSheetList);
}
