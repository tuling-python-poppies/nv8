import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { elementChildren } from "./element-state.js";

export const children = Object.getOwnPropertyDescriptor({
  get children() {
    const value = elementChildren(this);
    traceGetter("window.Element.prototype.children", "Element", value);
    return value;
  },
}, "children").get;
registerNativeGetter(children, "children");
export function installElementChildren() {
  definePrototypeGetter(Element.prototype, "children", children);
}
