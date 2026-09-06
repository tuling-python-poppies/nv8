import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const cpuPerformance = Object.getOwnPropertyDescriptor({
  get cpuPerformance() {
    const value = navigatorField(this, "cpuPerformance");
    traceGetter("window.Navigator.prototype.cpuPerformance", "Navigator", value);
    return value;
  },
}, "cpuPerformance").get;
registerNativeGetter(cpuPerformance, "cpuPerformance");

export function installNavigatorCPUPerformance() {
  Object.defineProperty(Navigator.prototype, "cpuPerformance", {
    get: cpuPerformance,
    enumerable: true,
    configurable: true,
  });
}
