import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { MutationObserver } from "./mutation-observer-constructor.js";
import { disconnectObserver } from "./mutation-observer-state.js";

export const disconnect = {
  disconnect() {
    disconnectObserver(this);
    traceCall(
      "window.MutationObserver.prototype.disconnect",
      "MutationObserver",
      [],
      undefined,
    );
  },
}.disconnect;
registerNativeFunction(disconnect, "disconnect");
export function installMutationObserverDisconnect() {
  definePrototypeMethod(MutationObserver.prototype, "disconnect", disconnect);
}
