import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Attr } from "./attr-constructor.js";
import { requireAttr } from "./attr-state.js";

export const ownerElement = Object.getOwnPropertyDescriptor({
  get ownerElement() {
    const value = requireAttr(this).ownerElement;
    traceGetter("window.Attr.prototype.ownerElement", "Attr", value);
    return value;
  },
}, "ownerElement").get;
registerNativeGetter(ownerElement, "ownerElement");
export function installAttrOwnerElement() {
  definePrototypeGetter(Attr.prototype, "ownerElement", ownerElement);
}
