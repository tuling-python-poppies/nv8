import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const getInstalledRelatedApps = {
  getInstalledRelatedApps() {
    requireNavigator(this);
    const value = Promise.resolve([]);
    traceCall(
      "window.Navigator.prototype.getInstalledRelatedApps",
      "Navigator",
      [],
      value,
    );
    return value;
  },
}.getInstalledRelatedApps;
registerNativeFunction(getInstalledRelatedApps, "getInstalledRelatedApps");
export function installNavigatorGetInstalledRelatedApps() {
  definePrototypeMethod(
    Navigator.prototype,
    "getInstalledRelatedApps",
    getInstalledRelatedApps,
  );
}
