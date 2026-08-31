import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Attr } from "./attr-constructor.js";
import { requireAttr } from "./attr-state.js";

export const name = Object.getOwnPropertyDescriptor({
  get name() {
    const value = requireAttr(this).name;
    traceGetter("window.Attr.prototype.name", "Attr", value);
    return value;
  },
}, "name").get;
registerNativeGetter(name, "name");
export function installAttrName() {
  definePrototypeGetter(Attr.prototype, "name", name);
}
