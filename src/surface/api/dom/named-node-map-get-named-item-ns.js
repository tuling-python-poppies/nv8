import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { namedItemNS } from "./named-node-map-state.js";

export const getNamedItemNS = {
  getNamedItemNS(namespace, localName) {
    const result = namedItemNS(this, namespace, localName);
    traceCall(
      "window.NamedNodeMap.prototype.getNamedItemNS",
      "NamedNodeMap",
      [namespace, localName],
      result,
    );
    return result;
  },
}.getNamedItemNS;
registerNativeFunction(getNamedItemNS, "getNamedItemNS");
export function installNamedNodeMapGetNamedItemNS() {
  definePrototypeMethod(NamedNodeMap.prototype, "getNamedItemNS", getNamedItemNS);
}
