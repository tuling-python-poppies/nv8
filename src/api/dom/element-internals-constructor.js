import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function ElementInternals() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ElementInternals, "ElementInternals");

export function installElementInternalsConstructor() {
  delete ElementInternals.prototype.constructor;
  defineGlobalConstructor("ElementInternals", ElementInternals);
}
