import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const userActivation = Object.getOwnPropertyDescriptor({
  get userActivation() {
    const value = navigatorService(this, "userActivation");
    traceGetter("window.Navigator.prototype.userActivation", "Navigator", value);
    return value;
  },
}, "userActivation").get;
registerNativeGetter(userActivation, "userActivation");
export function installNavigatorUserActivation() {
  definePrototypeGetter(Navigator.prototype, "userActivation", userActivation);
}
