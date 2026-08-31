import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";

export const localName = Object.getOwnPropertyDescriptor({
  get localName() {
    const value = requireElement(this).localName;
    traceGetter("window.Element.prototype.localName", "Element", value);
    return value;
  },
}, "localName").get;
registerNativeGetter(localName, "localName");
export function installElementLocalName() {
  definePrototypeGetter(Element.prototype, "localName", localName);
}
