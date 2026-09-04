import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { nextSiblingValue } from "./node-getters.js";

export const nextSibling = Object.getOwnPropertyDescriptor({
  get nextSibling() {
    const value = nextSiblingValue(this);
    traceGetter("window.Node.prototype.nextSibling", "Node", value);
    return value;
  },
}, "nextSibling").get;
registerNativeGetter(nextSibling, "nextSibling");
export function installNodeNextSibling() {
  definePrototypeGetter(Node.prototype, "nextSibling", nextSibling);
}
