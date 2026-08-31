import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const userAgentData = Object.getOwnPropertyDescriptor({
  get userAgentData() {
    const value = navigatorService(this, "userAgentData");
    traceGetter("window.Navigator.prototype.userAgentData", "Navigator", value);
    return value;
  },
}, "userAgentData").get;
registerNativeGetter(userAgentData, "userAgentData");
export function installNavigatorUserAgentData() {
  definePrototypeGetter(Navigator.prototype, "userAgentData", userAgentData);
}
