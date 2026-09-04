import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function ElementInternals() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ElementInternals, "ElementInternals");

export function installElementInternalsConstructor() {
  delete ElementInternals.prototype.constructor;
  defineGlobalConstructor("ElementInternals", ElementInternals);
}
