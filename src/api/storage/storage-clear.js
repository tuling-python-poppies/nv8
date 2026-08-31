import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Storage } from "./storage-constructor.js";
import { requireStorage } from "./storage-state.js";

export const clear = {
  clear() {
    const state = requireStorage(this);
    state.order.length = 0;
    state.values.clear();
    traceCall("window.Storage.prototype.clear", "Storage", [], undefined);
  },
}.clear;
registerNativeFunction(clear, "clear");
export function installStorageClear() {
  definePrototypeMethod(Storage.prototype, "clear", clear);
}
