import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { parentNodeValue } from "./node-getters.js";

export const parentNode = Object.getOwnPropertyDescriptor({
  get parentNode() {
    const value = parentNodeValue(this);
    traceGetter("window.Node.prototype.parentNode", "Node", value);
    return value;
  },
}, "parentNode").get;
registerNativeGetter(parentNode, "parentNode");
export function installNodeParentNode() {
  definePrototypeGetter(Node.prototype, "parentNode", parentNode);
}
