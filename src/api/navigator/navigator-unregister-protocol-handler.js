import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const unregisterProtocolHandler = {
  unregisterProtocolHandler(scheme, url) {
    requireNavigator(this);
    if (arguments.length < 2) {
      throw new TypeError("A scheme and URL are required.");
    }
    traceCall(
      "window.Navigator.prototype.unregisterProtocolHandler",
      "Navigator",
      [`${scheme}`, `${url}`],
      undefined,
    );
  },
}.unregisterProtocolHandler;
registerNativeFunction(unregisterProtocolHandler, "unregisterProtocolHandler");
export function installNavigatorUnregisterProtocolHandler() {
  definePrototypeMethod(
    Navigator.prototype,
    "unregisterProtocolHandler",
    unregisterProtocolHandler,
  );
}
