import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const deviceMemory = Object.getOwnPropertyDescriptor({
  get deviceMemory() {
    const value = navigatorField(this, "deviceMemory");
    traceGetter("window.Navigator.prototype.deviceMemory", "Navigator", value);
    return value;
  },
}, "deviceMemory").get;
registerNativeGetter(deviceMemory, "deviceMemory");
export function installNavigatorDeviceMemory() {
  definePrototypeGetter(Navigator.prototype, "deviceMemory", deviceMemory);
}
