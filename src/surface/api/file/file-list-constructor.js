import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function FileList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(FileList, "FileList");

export function installFileListConstructor() {
  delete FileList.prototype.constructor;
  defineGlobalConstructor("FileList", FileList);
}
