import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { NodeList } from "./node-list-constructor.js";
import { refreshNodeList } from "./node-list-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const value = refreshNodeList(this).length;
    traceGetter("window.NodeList.prototype.length", "NodeList", value);
    return value;
  },
}, "length").get;

registerNativeGetter(length, "length");

export function installNodeListLength() {
  definePrototypeGetter(NodeList.prototype, "length", length);
}
