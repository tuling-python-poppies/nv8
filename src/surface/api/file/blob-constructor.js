import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeBlob } from "./blob-state.js";

export function Blob() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'Blob': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  const parts = arguments[0] === undefined ? [] : Array.from(arguments[0]);
  const options = arguments[1] === undefined ? {} : Object(arguments[1]);
  initializeBlob(this, parts, options);
  traceConstruct("window.Blob", [...arguments], "Blob");
}
registerNativeFunction(Blob, "Blob");

export function installBlobConstructor() {
  delete Blob.prototype.constructor;
  defineGlobalConstructor("Blob", Blob);
}
