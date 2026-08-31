import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const serviceWorker = Object.getOwnPropertyDescriptor({
  get serviceWorker() {
    const value = navigatorService(this, "serviceWorker");
    traceGetter("window.Navigator.prototype.serviceWorker", "Navigator", value);
    return value;
  },
}, "serviceWorker").get;
registerNativeGetter(serviceWorker, "serviceWorker");
export function installNavigatorServiceWorker() {
  definePrototypeGetter(Navigator.prototype, "serviceWorker", serviceWorker);
}
