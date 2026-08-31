import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { Storage } from "./storage-constructor.js";
import { requireStorage } from "./storage-state.js";

export const getItem = {
  getItem(key) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "getItem",
      getItem,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const state = requireStorage(this);
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'getItem' on 'Storage': 1 argument required.");
    }
    const normalized = `${key}`;
    const value = state.values.get(normalized) ?? null;
    traceCall("window.Storage.prototype.getItem", "Storage", [normalized], value);
    return value;
  },
}.getItem;
registerNativeFunction(getItem, "getItem");
export function installStorageGetItem() {
  definePrototypeMethod(Storage.prototype, "getItem", getItem);
}
