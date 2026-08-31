import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const canShare = {
  canShare() {
    requireNavigator(this);
    const data = arguments[0];
    const value = data === undefined || (
      data !== null
      && typeof data === "object"
      && (
        typeof data.title === "string"
        || typeof data.text === "string"
        || typeof data.url === "string"
      )
    );
    traceCall(
      "window.Navigator.prototype.canShare",
      "Navigator",
      data === undefined ? [] : [data],
      value,
    );
    return value;
  },
}.canShare;
registerNativeFunction(canShare, "canShare");
export function installNavigatorCanShare() {
  definePrototypeMethod(Navigator.prototype, "canShare", canShare);
}
