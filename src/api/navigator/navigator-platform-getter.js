import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const platform = Object.getOwnPropertyDescriptor({
  get platform() {
    const value = navigatorField(this, "platform");
    traceGetter("window.Navigator.prototype.platform", "Navigator", value);
    return value;
  },
}, "platform").get;
registerNativeGetter(platform, "platform");
export function installNavigatorPlatform() {
  definePrototypeGetter(Navigator.prototype, "platform", platform);
}
