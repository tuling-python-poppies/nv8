import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";

export const tagName = Object.getOwnPropertyDescriptor({
  get tagName() {
    const value = requireElement(this).tagName;
    traceGetter("window.Element.prototype.tagName", "Element", value);
    return value;
  },
}, "tagName").get;
registerNativeGetter(tagName, "tagName");
export function installElementTagName() {
  definePrototypeGetter(Element.prototype, "tagName", tagName);
}
