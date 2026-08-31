import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NodeList } from "./node-list-constructor.js";
import { refreshNodeList } from "./node-list-state.js";

export const keys = {
  keys() {
    const result = refreshNodeList(this).keys();
    traceCall("window.NodeList.prototype.keys", "NodeList", [], result);
    return result;
  },
}.keys;

registerNativeFunction(keys, "keys");

export function installNodeListKeys() {
  definePrototypeMethod(NodeList.prototype, "keys", keys);
}
