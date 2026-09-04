import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const gpu = Object.getOwnPropertyDescriptor({
  get gpu() {
    const value = navigatorService(this, "gpu");
    traceGetter("window.Navigator.prototype.gpu", "Navigator", value);
    return value;
  },
}, "gpu").get;
registerNativeGetter(gpu, "gpu");
export function installNavigatorGpu() {
  definePrototypeGetter(Navigator.prototype, "gpu", gpu);
}
