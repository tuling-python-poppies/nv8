import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function CanvasGradient() {
  throw new TypeError(
    "Failed to construct 'CanvasGradient': Illegal constructor",
  );
}
registerNativeFunction(CanvasGradient, "CanvasGradient");

export function installCanvasGradientConstructor() {
  delete CanvasGradient.prototype.constructor;
  defineGlobalConstructor("CanvasGradient", CanvasGradient);
}
