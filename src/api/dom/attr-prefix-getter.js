import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Attr } from "./attr-constructor.js";
import { requireAttr } from "./attr-state.js";

export const prefix = Object.getOwnPropertyDescriptor({
  get prefix() {
    const value = requireAttr(this).prefix;
    traceGetter("window.Attr.prototype.prefix", "Attr", value);
    return value;
  },
}, "prefix").get;
registerNativeGetter(prefix, "prefix");
export function installAttrPrefix() {
  definePrototypeGetter(Attr.prototype, "prefix", prefix);
}
