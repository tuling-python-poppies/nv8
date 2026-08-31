import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Storage } from "./storage-constructor.js";
import { requireStorage } from "./storage-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const value = requireStorage(this).order.length;
    traceGetter("window.Storage.prototype.length", "Storage", value);
    return value;
  },
}, "length").get;
registerNativeGetter(length, "length");
export function installStorageLength() {
  definePrototypeGetter(Storage.prototype, "length", length);
}
