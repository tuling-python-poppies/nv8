import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { firstChildValue } from "./node-getters.js";

export const firstChild = Object.getOwnPropertyDescriptor({
  get firstChild() {
    const value = firstChildValue(this);
    traceGetter("window.Node.prototype.firstChild", "Node", value);
    return value;
  },
}, "firstChild").get;
registerNativeGetter(firstChild, "firstChild");
export function installNodeFirstChild() {
  definePrototypeGetter(Node.prototype, "firstChild", firstChild);
}
