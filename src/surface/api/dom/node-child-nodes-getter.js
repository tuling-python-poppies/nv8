import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { childNodesValue } from "./node-getters.js";

export const childNodes = Object.getOwnPropertyDescriptor({
  get childNodes() {
    const value = childNodesValue(this);
    traceGetter("window.Node.prototype.childNodes", "Node", value);
    return value;
  },
}, "childNodes").get;
registerNativeGetter(childNodes, "childNodes");
export function installNodeChildNodes() {
  definePrototypeGetter(Node.prototype, "childNodes", childNodes);
}
