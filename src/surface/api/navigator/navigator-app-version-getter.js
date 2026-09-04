import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const appVersion = Object.getOwnPropertyDescriptor({
  get appVersion() {
    const value = navigatorField(this, "appVersion");
    traceGetter("window.Navigator.prototype.appVersion", "Navigator", value);
    return value;
  },
}, "appVersion").get;
registerNativeGetter(appVersion, "appVersion");
export function installNavigatorAppVersion() {
  definePrototypeGetter(Navigator.prototype, "appVersion", appVersion);
}
