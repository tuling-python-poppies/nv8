import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const deprecatedReplaceInURN = {
  deprecatedReplaceInURN(urn, replacements) {
    requireNavigator(this);
    if (arguments.length < 2) {
      throw new TypeError("A URN and replacements are required");
    }
    const value = Promise.resolve(undefined);
    traceCall(
      "window.Navigator.prototype.deprecatedReplaceInURN",
      "Navigator",
      [urn, replacements],
      value,
    );
    return value;
  },
}.deprecatedReplaceInURN;
registerNativeFunction(deprecatedReplaceInURN, "deprecatedReplaceInURN");
export function installNavigatorDeprecatedReplaceInURN() {
  definePrototypeMethod(
    Navigator.prototype,
    "deprecatedReplaceInURN",
    deprecatedReplaceInURN,
  );
}
