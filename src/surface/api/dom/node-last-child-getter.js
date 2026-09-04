import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { lastChildValue } from "./node-getters.js";

export const lastChild = Object.getOwnPropertyDescriptor({
  get lastChild() {
    const value = lastChildValue(this);
    traceGetter("window.Node.prototype.lastChild", "Node", value);
    return value;
  },
}, "lastChild").get;
registerNativeGetter(lastChild, "lastChild");
export function installNodeLastChild() {
  definePrototypeGetter(Node.prototype, "lastChild", lastChild);
}
