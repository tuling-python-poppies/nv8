import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const devicePosture = Object.getOwnPropertyDescriptor({
  get devicePosture() {
    const value = navigatorService(this, "devicePosture");
    traceGetter("window.Navigator.prototype.devicePosture", "Navigator", value);
    return value;
  },
}, "devicePosture").get;
registerNativeGetter(devicePosture, "devicePosture");
export function installNavigatorDevicePosture() {
  definePrototypeGetter(Navigator.prototype, "devicePosture", devicePosture);
}
