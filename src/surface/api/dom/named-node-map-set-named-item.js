import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { setNamedItemAlgorithm } from "./named-node-map-state.js";

const setNamedItem = {
  setNamedItem(attr) {
    const result = setNamedItemAlgorithm(this, attr, false);
    traceCall("window.NamedNodeMap.prototype.setNamedItem", "NamedNodeMap", [attr], result);
    return result;
  },
}.setNamedItem;
registerNativeFunction(setNamedItem, "setNamedItem");
export function installNamedNodeMapSetNamedItem() {
  definePrototypeMethod(NamedNodeMap.prototype, "setNamedItem", setNamedItem);
}
