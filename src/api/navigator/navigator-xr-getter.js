import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const xr = Object.getOwnPropertyDescriptor({
  get xr() {
    const value = navigatorService(this, "xr");
    traceGetter("window.Navigator.prototype.xr", "Navigator", value);
    return value;
  },
}, "xr").get;
registerNativeGetter(xr, "xr");
export function installNavigatorXr() {
  definePrototypeGetter(Navigator.prototype, "xr", xr);
}
