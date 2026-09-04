import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { createDOMTokenList } from "./dom-token-list-state.js";
import { requireElement } from "./element-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const linkTokenSlot = createRealmSlot(() => ({
  stores: new Map(),
}), "linkToken");

function linkTokenState() {
  return linkTokenSlot.get(globalThis);
}


export function linkTokenListProperty(property, attribute) {
  const values = new WeakMap();
  linkTokenState().stores.set(property, values);
  const descriptor = Object.getOwnPropertyDescriptor({
    get [property]() {
      requireElement(this);
      let result = values.get(this);
      if (result === undefined) {
        result = createDOMTokenList(this, attribute);
        values.set(this, result);
      }
      traceGetter(`window.HTMLLinkElement.prototype.${property}`, "HTMLLinkElement", result);
      return result;
    },
    set [property](value) {
      requireElement(this);
      this.setAttribute(attribute, `${value}`);
    },
  }, property);
  registerNativeGetter(descriptor.get, property);
  registerNativeFunction(descriptor.set, `set ${property}`);
  return descriptor;
}
