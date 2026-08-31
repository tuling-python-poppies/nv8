import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Storage } from "./storage-constructor.js";
import { requireStorage } from "./storage-state.js";

export const key = {
  key(index) {
    const state = requireStorage(this);
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'key' on 'Storage': 1 argument required.");
    }
    const number = Number(index);
    const normalized = Number.isFinite(number) && number >= 0
      ? Math.trunc(number)
      : 0xffffffff;
    const value = state.order[normalized] ?? null;
    traceCall("window.Storage.prototype.key", "Storage", [normalized], value);
    return value;
  },
}.key;
registerNativeFunction(key, "key");
export function installStorageKey() {
  definePrototypeMethod(Storage.prototype, "key", key);
}
