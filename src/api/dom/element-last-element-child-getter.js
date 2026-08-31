import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { elementChildren } from "./element-state.js";

export const lastElementChild = Object.getOwnPropertyDescriptor({
  get lastElementChild() {
    const collection = elementChildren(this);
    const value = collection.item(collection.length - 1);
    traceGetter("window.Element.prototype.lastElementChild", "Element", value);
    return value;
  },
}, "lastElementChild").get;
registerNativeGetter(lastElementChild, "lastElementChild");
export function installElementLastElementChild() {
  definePrototypeGetter(Element.prototype, "lastElementChild", lastElementChild);
}
