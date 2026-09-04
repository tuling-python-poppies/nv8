import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const runAdAuction = {
  runAdAuction(configuration) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError("runAdAuction requires a configuration");
    }
    const value = Promise.resolve(null);
    traceCall("window.Navigator.prototype.runAdAuction", "Navigator", [configuration], value);
    return value;
  },
}.runAdAuction;
registerNativeFunction(runAdAuction, "runAdAuction");
export function installNavigatorRunAdAuction() {
  definePrototypeMethod(Navigator.prototype, "runAdAuction", runAdAuction);
}
