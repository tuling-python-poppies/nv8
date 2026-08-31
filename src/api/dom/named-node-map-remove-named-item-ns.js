import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NamedNodeMap } from "./named-node-map-constructor.js";
import { removeNamedItemAlgorithm } from "./named-node-map-state.js";

export const removeNamedItemNS = {
  removeNamedItemNS(namespace, localName) {
    const result = removeNamedItemAlgorithm(this, namespace, true, localName);
    traceCall(
      "window.NamedNodeMap.prototype.removeNamedItemNS",
      "NamedNodeMap",
      [namespace, localName],
      result,
    );
    return result;
  },
}.removeNamedItemNS;
registerNativeFunction(removeNamedItemNS, "removeNamedItemNS");
export function installNamedNodeMapRemoveNamedItemNS() {
  definePrototypeMethod(
    NamedNodeMap.prototype,
    "removeNamedItemNS",
    removeNamedItemNS,
  );
}
