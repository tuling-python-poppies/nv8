import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Attr } from "./attr-constructor.js";
import { requireAttr } from "./attr-state.js";

export const namespaceURI = Object.getOwnPropertyDescriptor({
  get namespaceURI() {
    const value = requireAttr(this).namespaceURI;
    traceGetter("window.Attr.prototype.namespaceURI", "Attr", value);
    return value;
  },
}, "namespaceURI").get;
registerNativeGetter(namespaceURI, "namespaceURI");
export function installAttrNamespaceURI() {
  definePrototypeGetter(Attr.prototype, "namespaceURI", namespaceURI);
}
