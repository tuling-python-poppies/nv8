import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const wakeLock = Object.getOwnPropertyDescriptor({
  get wakeLock() {
    const value = navigatorService(this, "wakeLock");
    traceGetter("window.Navigator.prototype.wakeLock", "Navigator", value);
    return value;
  },
}, "wakeLock").get;
registerNativeGetter(wakeLock, "wakeLock");
export function installNavigatorWakeLock() {
  definePrototypeGetter(Navigator.prototype, "wakeLock", wakeLock);
}
