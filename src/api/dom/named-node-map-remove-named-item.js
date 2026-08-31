import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { removeNamedItemAlgorithm } from "./named-node-map-state.js";

export const removeNamedItem = {
  removeNamedItem(name) {
    const result = removeNamedItemAlgorithm(this, name);
    traceCall("window.NamedNodeMap.prototype.removeNamedItem", "NamedNodeMap", [name], result);
    return result;
  },
}.removeNamedItem;
registerNativeFunction(removeNamedItem, "removeNamedItem");
export function installNamedNodeMapRemoveNamedItem() {
  definePrototypeMethod(NamedNodeMap.prototype, "removeNamedItem", removeNamedItem);
}
