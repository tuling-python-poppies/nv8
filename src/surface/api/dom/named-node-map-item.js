import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { refreshNamedNodeMap } from "./named-node-map-state.js";

export const item = {
  item(index) {
    const result = refreshNamedNodeMap(this)[Number(index) >>> 0] ?? null;
    traceCall("window.NamedNodeMap.prototype.item", "NamedNodeMap", [index], result);
    return result;
  },
}.item;
registerNativeFunction(item, "item");
export function installNamedNodeMapItem() {
  definePrototypeMethod(NamedNodeMap.prototype, "item", item);
}
