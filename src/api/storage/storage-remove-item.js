import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Storage } from "./storage-constructor.js";
import { requireStorage } from "./storage-state.js";

export const removeItem = {
  removeItem(key) {
    const state = requireStorage(this);
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'removeItem' on 'Storage': 1 argument required.",
      );
    }
    const normalized = `${key}`;
    state.values.delete(normalized);
    const index = state.order.indexOf(normalized);
    if (index !== -1) {
      state.order.splice(index, 1);
    }
    traceCall(
      "window.Storage.prototype.removeItem",
      "Storage",
      [normalized],
      undefined,
    );
  },
}.removeItem;
registerNativeFunction(removeItem, "removeItem");
export function installStorageRemoveItem() {
  definePrototypeMethod(Storage.prototype, "removeItem", removeItem);
}
