import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { elementChildren } from "./element-state.js";

export const firstElementChild = Object.getOwnPropertyDescriptor({
  get firstElementChild() {
    const value = elementChildren(this).item(0);
    traceGetter("window.Element.prototype.firstElementChild", "Element", value);
    return value;
  },
}, "firstElementChild").get;
registerNativeGetter(firstElementChild, "firstElementChild");
export function installElementFirstElementChild() {
  definePrototypeGetter(Element.prototype, "firstElementChild", firstElementChild);
}
