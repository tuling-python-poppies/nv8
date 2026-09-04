import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const usb = Object.getOwnPropertyDescriptor({
  get usb() {
    const value = navigatorService(this, "usb");
    traceGetter("window.Navigator.prototype.usb", "Navigator", value);
    return value;
  },
}, "usb").get;
registerNativeGetter(usb, "usb");
export function installNavigatorUsb() {
  definePrototypeGetter(Navigator.prototype, "usb", usb);
}
