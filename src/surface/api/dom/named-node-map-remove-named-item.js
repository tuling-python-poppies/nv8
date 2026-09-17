import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { removeNamedItemAlgorithm } from "./named-node-map-state.js";

const removeNamedItem = {
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
