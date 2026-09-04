import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";

export const namespaceURI = Object.getOwnPropertyDescriptor({
  get namespaceURI() {
    const value = requireElement(this).namespaceURI;
    traceGetter("window.Element.prototype.namespaceURI", "Element", value);
    return value;
  },
}, "namespaceURI").get;
registerNativeGetter(namespaceURI, "namespaceURI");
export function installElementNamespaceURI() {
  definePrototypeGetter(Element.prototype, "namespaceURI", namespaceURI);
}
