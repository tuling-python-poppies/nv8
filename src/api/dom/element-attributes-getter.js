import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";

export const attributes = Object.getOwnPropertyDescriptor({
  get attributes() {
    const value = requireElement(this).attributes;
    traceGetter("window.Element.prototype.attributes", "Element", value);
    return value;
  },
}, "attributes").get;
registerNativeGetter(attributes, "attributes");
export function installElementAttributes() {
  definePrototypeGetter(Element.prototype, "attributes", attributes);
}
