import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
