import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Attr } from "./attr-constructor.js";
import { requireAttr } from "./attr-state.js";

export const specified = Object.getOwnPropertyDescriptor({
  get specified() {
    requireAttr(this);
    traceGetter("window.Attr.prototype.specified", "Attr", true);
    return true;
  },
}, "specified").get;
registerNativeGetter(specified, "specified");
export function installAttrSpecified() {
  definePrototypeGetter(Attr.prototype, "specified", specified);
}
