import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { previousSiblingValue } from "./node-getters.js";

export const previousSibling = Object.getOwnPropertyDescriptor({
  get previousSibling() {
    const value = previousSiblingValue(this);
    traceGetter("window.Node.prototype.previousSibling", "Node", value);
    return value;
  },
}, "previousSibling").get;
registerNativeGetter(previousSibling, "previousSibling");
export function installNodePreviousSibling() {
  definePrototypeGetter(Node.prototype, "previousSibling", previousSibling);
}
