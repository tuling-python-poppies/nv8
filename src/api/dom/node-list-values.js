import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NodeList } from "./node-list-constructor.js";
import { refreshNodeList } from "./node-list-state.js";

export const values = {
  values() {
    const result = refreshNodeList(this)[Symbol.iterator]();
    traceCall("window.NodeList.prototype.values", "NodeList", [], result);
    return result;
  },
}.values;

registerNativeFunction(values, "values");

export function installNodeListValues() {
  definePrototypeMethod(NodeList.prototype, "values", values);
}
