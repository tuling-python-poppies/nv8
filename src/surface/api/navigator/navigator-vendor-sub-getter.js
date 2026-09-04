import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const vendorSub = Object.getOwnPropertyDescriptor({
  get vendorSub() {
    const value = navigatorField(this, "vendorSub");
    traceGetter("window.Navigator.prototype.vendorSub", "Navigator", value);
    return value;
  },
}, "vendorSub").get;
registerNativeGetter(vendorSub, "vendorSub");
export function installNavigatorVendorSub() {
  definePrototypeGetter(Navigator.prototype, "vendorSub", vendorSub);
}
