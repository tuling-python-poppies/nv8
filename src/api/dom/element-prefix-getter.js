import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";

export const prefix = Object.getOwnPropertyDescriptor({
  get prefix() {
    const value = requireElement(this).prefix;
    traceGetter("window.Element.prototype.prefix", "Element", value);
    return value;
  },
}, "prefix").get;
registerNativeGetter(prefix, "prefix");
export function installElementPrefix() {
  definePrototypeGetter(Element.prototype, "prefix", prefix);
}
