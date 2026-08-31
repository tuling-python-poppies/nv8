import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { elementChildren } from "./element-state.js";

export const childElementCount = Object.getOwnPropertyDescriptor({
  get childElementCount() {
    const value = elementChildren(this).length;
    traceGetter("window.Element.prototype.childElementCount", "Element", value);
    return value;
  },
}, "childElementCount").get;
registerNativeGetter(childElementCount, "childElementCount");
export function installElementChildElementCount() {
  definePrototypeGetter(Element.prototype, "childElementCount", childElementCount);
}
