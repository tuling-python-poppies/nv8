import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const protectedAudience = Object.getOwnPropertyDescriptor({
  get protectedAudience() {
    const value = navigatorService(this, "protectedAudience");
    traceGetter("window.Navigator.prototype.protectedAudience", "Navigator", value);
    return value;
  },
}, "protectedAudience").get;
registerNativeGetter(protectedAudience, "protectedAudience");
export function installNavigatorProtectedAudience() {
  definePrototypeGetter(Navigator.prototype, "protectedAudience", protectedAudience);
}
