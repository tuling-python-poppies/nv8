import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const deprecatedURNToURL = {
  deprecatedURNToURL(urn) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError("A URN is required");
    }
    const value = Promise.resolve(`${urn}`);
    traceCall(
      "window.Navigator.prototype.deprecatedURNToURL",
      "Navigator",
      [urn],
      value,
    );
    return value;
  },
}.deprecatedURNToURL;
registerNativeFunction(deprecatedURNToURL, "deprecatedURNToURL");
export function installNavigatorDeprecatedURNToURL() {
  definePrototypeMethod(
    Navigator.prototype,
    "deprecatedURNToURL",
    deprecatedURNToURL,
  );
}
