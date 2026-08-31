import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function CanvasPattern() {
  throw new TypeError(
    "Failed to construct 'CanvasPattern': Illegal constructor",
  );
}
registerNativeFunction(CanvasPattern, "CanvasPattern");

export function installCanvasPatternConstructor() {
  delete CanvasPattern.prototype.constructor;
  defineGlobalConstructor("CanvasPattern", CanvasPattern);
}
