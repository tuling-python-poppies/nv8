import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const serial = Object.getOwnPropertyDescriptor({
  get serial() {
    const value = navigatorService(this, "serial");
    traceGetter("window.Navigator.prototype.serial", "Navigator", value);
    return value;
  },
}, "serial").get;
registerNativeGetter(serial, "serial");
export function installNavigatorSerial() {
  definePrototypeGetter(Navigator.prototype, "serial", serial);
}
