import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const registerProtocolHandler = {
  registerProtocolHandler(scheme, url) {
    requireNavigator(this);
    if (arguments.length < 2) {
      throw new TypeError("A scheme and URL are required.");
    }
    const normalizedScheme = `${scheme}`;
    const normalizedUrl = `${url}`;
    if (normalizedScheme === "" || !normalizedUrl.includes("%s")) {
      throw new TypeError("The handler URL must contain %s.");
    }
    traceCall(
      "window.Navigator.prototype.registerProtocolHandler",
      "Navigator",
      [normalizedScheme, normalizedUrl],
      undefined,
    );
  },
}.registerProtocolHandler;
registerNativeFunction(registerProtocolHandler, "registerProtocolHandler");
export function installNavigatorRegisterProtocolHandler() {
  definePrototypeMethod(
    Navigator.prototype,
    "registerProtocolHandler",
    registerProtocolHandler,
  );
}
