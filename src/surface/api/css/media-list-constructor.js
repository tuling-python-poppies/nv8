import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function MediaList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MediaList, "MediaList");

export function installMediaListConstructor() {
  delete MediaList.prototype.constructor;
  defineGlobalConstructor("MediaList", MediaList);
}
