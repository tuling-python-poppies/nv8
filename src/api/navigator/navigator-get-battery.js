import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const getBattery = {
  getBattery() {
    const battery = navigatorService(this, "battery");
    const value = Promise.resolve(battery);
    traceCall("window.Navigator.prototype.getBattery", "Navigator", [], value);
    return value;
  },
}.getBattery;
registerNativeFunction(getBattery, "getBattery");
export function installNavigatorGetBattery() {
  definePrototypeMethod(Navigator.prototype, "getBattery", getBattery);
}
