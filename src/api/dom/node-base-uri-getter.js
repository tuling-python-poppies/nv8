import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { baseURIValue } from "./node-getters.js";

export const baseURI = Object.getOwnPropertyDescriptor({
  get baseURI() {
    const value = baseURIValue(this);
    traceGetter("window.Node.prototype.baseURI", "Node", value);
    return value;
  },
}, "baseURI").get;
registerNativeGetter(baseURI, "baseURI");
export function installNodeBaseURI() {
  definePrototypeGetter(Node.prototype, "baseURI", baseURI);
}
