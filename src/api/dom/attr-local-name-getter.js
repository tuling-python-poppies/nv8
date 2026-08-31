import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Attr } from "./attr-constructor.js";
import { requireAttr } from "./attr-state.js";

export const localName = Object.getOwnPropertyDescriptor({
  get localName() {
    const value = requireAttr(this).localName;
    traceGetter("window.Attr.prototype.localName", "Attr", value);
    return value;
  },
}, "localName").get;
registerNativeGetter(localName, "localName");
export function installAttrLocalName() {
  definePrototypeGetter(Attr.prototype, "localName", localName);
}
