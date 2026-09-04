import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";
import { isConnectedValue } from "./node-getters.js";

export const isConnected = Object.getOwnPropertyDescriptor({
  get isConnected() {
    const value = isConnectedValue(this);
    traceGetter("window.Node.prototype.isConnected", "Node", value);
    return value;
  },
}, "isConnected").get;
registerNativeGetter(isConnected, "isConnected");
export function installNodeIsConnected() {
  definePrototypeGetter(Node.prototype, "isConnected", isConnected);
}
