import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const cookieEnabled = Object.getOwnPropertyDescriptor({
  get cookieEnabled() {
    const value = navigatorField(this, "cookieEnabled");
    traceGetter("window.Navigator.prototype.cookieEnabled", "Navigator", value);
    return value;
  },
}, "cookieEnabled").get;
registerNativeGetter(cookieEnabled, "cookieEnabled");
export function installNavigatorCookieEnabled() {
  definePrototypeGetter(Navigator.prototype, "cookieEnabled", cookieEnabled);
}
