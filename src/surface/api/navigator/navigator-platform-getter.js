import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
