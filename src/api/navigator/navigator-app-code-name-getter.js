import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const appCodeName = Object.getOwnPropertyDescriptor({
  get appCodeName() {
    const value = navigatorField(this, "appCodeName");
    traceGetter("window.Navigator.prototype.appCodeName", "Navigator", value);
    return value;
  },
}, "appCodeName").get;
registerNativeGetter(appCodeName, "appCodeName");
export function installNavigatorAppCodeName() {
  definePrototypeGetter(Navigator.prototype, "appCodeName", appCodeName);
}
