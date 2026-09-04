import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const bluetooth = Object.getOwnPropertyDescriptor({
  get bluetooth() {
    const value = navigatorService(this, "bluetooth");
    traceGetter("window.Navigator.prototype.bluetooth", "Navigator", value);
    return value;
  },
}, "bluetooth").get;
registerNativeGetter(bluetooth, "bluetooth");
export function installNavigatorBluetooth() {
  definePrototypeGetter(Navigator.prototype, "bluetooth", bluetooth);
}
