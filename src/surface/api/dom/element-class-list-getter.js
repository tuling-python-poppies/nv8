import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { createDOMTokenList } from "./dom-token-list-state.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";

export const classList = Object.getOwnPropertyDescriptor({
  get classList() {
    const state = requireElement(this);
    if (state.classList === null) {
      state.classList = createDOMTokenList(this, "class");
    }
    traceGetter("window.Element.prototype.classList", "Element", state.classList);
    return state.classList;
  },
}, "classList").get;
registerNativeGetter(classList, "classList");
export function installElementClassList() {
  definePrototypeGetter(Element.prototype, "classList", classList);
}
