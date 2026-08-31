import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { nodeTypeValue } from "./node-getters.js";

export const nodeType = Object.getOwnPropertyDescriptor({
  get nodeType() {
    const value = nodeTypeValue(this);
    traceGetter("window.Node.prototype.nodeType", "Node", value);
    return value;
  },
}, "nodeType").get;
registerNativeGetter(nodeType, "nodeType");
export function installNodeType() {
  definePrototypeGetter(Node.prototype, "nodeType", nodeType);
}
