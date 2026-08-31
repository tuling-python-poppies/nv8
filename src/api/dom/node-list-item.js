import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NodeList } from "./node-list-constructor.js";
import { refreshNodeList } from "./node-list-state.js";

export const item = {
  item(index) {
    const number = Number(index) >>> 0;
    const result = refreshNodeList(this)[number] ?? null;
    traceCall("window.NodeList.prototype.item", "NodeList", [index], result);
    return result;
  },
}.item;

registerNativeFunction(item, "item");

export function installNodeListItem() {
  definePrototypeMethod(NodeList.prototype, "item", item);
}
