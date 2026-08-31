import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { namedItem } from "./named-node-map-state.js";

export const getNamedItem = {
  getNamedItem(name) {
    const result = namedItem(this, name);
    traceCall("window.NamedNodeMap.prototype.getNamedItem", "NamedNodeMap", [name], result);
    return result;
  },
}.getNamedItem;
registerNativeFunction(getNamedItem, "getNamedItem");
export function installNamedNodeMapGetNamedItem() {
  definePrototypeMethod(NamedNodeMap.prototype, "getNamedItem", getNamedItem);
}
