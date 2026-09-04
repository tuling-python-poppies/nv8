import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { nodeNameValue } from "./node-getters.js";

export const nodeName = Object.getOwnPropertyDescriptor({
  get nodeName() {
    const value = nodeNameValue(this);
    traceGetter("window.Node.prototype.nodeName", "Node", value);
    return value;
  },
}, "nodeName").get;
registerNativeGetter(nodeName, "nodeName");
export function installNodeName() {
  definePrototypeGetter(Node.prototype, "nodeName", nodeName);
}
