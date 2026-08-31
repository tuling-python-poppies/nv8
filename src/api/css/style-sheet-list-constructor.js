import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function StyleSheetList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(StyleSheetList, "StyleSheetList");

export function installStyleSheetListConstructor() {
  delete StyleSheetList.prototype.constructor;
  defineGlobalConstructor("StyleSheetList", StyleSheetList);
}
