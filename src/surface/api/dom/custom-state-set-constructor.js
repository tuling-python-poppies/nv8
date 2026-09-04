import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function CustomStateSet() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CustomStateSet, "CustomStateSet");

export function installCustomStateSetConstructor() {
  delete CustomStateSet.prototype.constructor;
  defineGlobalConstructor("CustomStateSet", CustomStateSet);
}
