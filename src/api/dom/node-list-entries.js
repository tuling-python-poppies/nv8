import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NodeList } from "./node-list-constructor.js";
import { refreshNodeList } from "./node-list-state.js";

export const entries = {
  entries() {
    const result = refreshNodeList(this).entries();
    traceCall("window.NodeList.prototype.entries", "NodeList", [], result);
    return result;
  },
}.entries;

registerNativeFunction(entries, "entries");

export function installNodeListEntries() {
  definePrototypeMethod(NodeList.prototype, "entries", entries);
}
