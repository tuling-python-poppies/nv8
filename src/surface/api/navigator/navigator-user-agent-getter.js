import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const userAgent = Object.getOwnPropertyDescriptor({
  get userAgent() {
    const value = navigatorField(this, "userAgent");
    traceGetter("window.Navigator.prototype.userAgent", "Navigator", value);
    return value;
  },
}, "userAgent").get;
registerNativeGetter(userAgent, "userAgent");
export function installNavigatorUserAgent() {
  definePrototypeGetter(Navigator.prototype, "userAgent", userAgent);
}
