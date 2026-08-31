import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const vendor = Object.getOwnPropertyDescriptor({
  get vendor() {
    const value = navigatorField(this, "vendor");
    traceGetter("window.Navigator.prototype.vendor", "Navigator", value);
    return value;
  },
}, "vendor").get;
registerNativeGetter(vendor, "vendor");
export function installNavigatorVendor() {
  definePrototypeGetter(Navigator.prototype, "vendor", vendor);
}
