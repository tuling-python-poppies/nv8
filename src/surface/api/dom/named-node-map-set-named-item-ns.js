import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { setNamedItemAlgorithm } from "./named-node-map-state.js";

const setNamedItemNS = {
  setNamedItemNS(attr) {
    const result = setNamedItemAlgorithm(this, attr, true);
    traceCall("window.NamedNodeMap.prototype.setNamedItemNS", "NamedNodeMap", [attr], result);
    return result;
  },
}.setNamedItemNS;
registerNativeFunction(setNamedItemNS, "setNamedItemNS");
export function installNamedNodeMapSetNamedItemNS() {
  definePrototypeMethod(NamedNodeMap.prototype, "setNamedItemNS", setNamedItemNS);
}
