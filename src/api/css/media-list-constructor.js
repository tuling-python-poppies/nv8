import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function MediaList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MediaList, "MediaList");

export function installMediaListConstructor() {
  delete MediaList.prototype.constructor;
  defineGlobalConstructor("MediaList", MediaList);
}
