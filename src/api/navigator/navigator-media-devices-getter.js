import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const mediaDevices = Object.getOwnPropertyDescriptor({
  get mediaDevices() {
    const value = navigatorService(this, "mediaDevices");
    traceGetter("window.Navigator.prototype.mediaDevices", "Navigator", value);
    return value;
  },
}, "mediaDevices").get;
registerNativeGetter(mediaDevices, "mediaDevices");
export function installNavigatorMediaDevices() {
  definePrototypeGetter(Navigator.prototype, "mediaDevices", mediaDevices);
}
