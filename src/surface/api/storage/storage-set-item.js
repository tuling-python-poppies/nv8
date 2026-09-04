import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { Storage } from "./storage-constructor.js";
import { requireStorage } from "./storage-state.js";

export const setItem = {
  setItem(key, value) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "setItem",
      setItem,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const state = requireStorage(this);
    if (arguments.length < 2) {
      throw new TypeError("Failed to execute 'setItem' on 'Storage': 2 arguments required.");
    }
    const normalizedKey = `${key}`;
    const normalizedValue = `${value}`;
    if (!state.values.has(normalizedKey)) {
      state.order.push(normalizedKey);
    }
    state.values.set(normalizedKey, normalizedValue);
    traceCall(
      "window.Storage.prototype.setItem",
      "Storage",
      [normalizedKey, normalizedValue],
      undefined,
    );
  },
}.setItem;
registerNativeFunction(setItem, "setItem");
export function installStorageSetItem() {
  definePrototypeMethod(Storage.prototype, "setItem", setItem);
}
