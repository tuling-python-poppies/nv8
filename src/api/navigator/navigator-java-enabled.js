import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const javaEnabled = {
  javaEnabled() {
    requireNavigator(this);
    traceCall(
      "window.Navigator.prototype.javaEnabled",
      "Navigator",
      [],
      false,
    );
    return false;
  },
}.javaEnabled;
registerNativeFunction(javaEnabled, "javaEnabled");
export function installNavigatorJavaEnabled() {
  definePrototypeMethod(Navigator.prototype, "javaEnabled", javaEnabled);
}
