import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const appName = Object.getOwnPropertyDescriptor({
  get appName() {
    const value = navigatorField(this, "appName");
    traceGetter("window.Navigator.prototype.appName", "Navigator", value);
    return value;
  },
}, "appName").get;
registerNativeGetter(appName, "appName");
export function installNavigatorAppName() {
  definePrototypeGetter(Navigator.prototype, "appName", appName);
}
