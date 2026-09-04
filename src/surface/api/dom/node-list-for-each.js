import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NodeList } from "./node-list-constructor.js";
import { refreshNodeList } from "./node-list-state.js";

export const forEach = {
  forEach(callback) {
    if (typeof callback !== "function") {
      throw new TypeError(`${callback} is not a function`);
    }
    const thisArg = arguments[1];
    const values = refreshNodeList(this);
    values.forEach((value, index) => callback.call(thisArg, value, index, this));
    traceCall("window.NodeList.prototype.forEach", "NodeList", [callback], undefined);
  },
}.forEach;

registerNativeFunction(forEach, "forEach");

export function installNodeListForEach() {
  definePrototypeMethod(NodeList.prototype, "forEach", forEach);
}
