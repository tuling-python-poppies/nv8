import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
export function MediaError() {
  throw new TypeError(
    "Failed to construct 'MediaError': Illegal constructor",
  );
}
registerNativeFunction(MediaError, "MediaError");
export function installMediaErrorConstructor() {
  delete MediaError.prototype.constructor;
  defineGlobalConstructor("MediaError", MediaError);
}
