import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
