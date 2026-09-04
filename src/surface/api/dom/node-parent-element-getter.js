import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { parentElementValue } from "./node-getters.js";

export const parentElement = Object.getOwnPropertyDescriptor({
  get parentElement() {
    const value = parentElementValue(this);
    traceGetter("window.Node.prototype.parentElement", "Node", value);
    return value;
  },
}, "parentElement").get;
registerNativeGetter(parentElement, "parentElement");
export function installNodeParentElement() {
  definePrototypeGetter(Node.prototype, "parentElement", parentElement);
}
