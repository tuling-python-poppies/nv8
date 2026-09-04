import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const permissions = Object.getOwnPropertyDescriptor({
  get permissions() {
    const value = navigatorService(this, "permissions");
    traceGetter("window.Navigator.prototype.permissions", "Navigator", value);
    return value;
  },
}, "permissions").get;
registerNativeGetter(permissions, "permissions");
export function installNavigatorPermissions() {
  definePrototypeGetter(Navigator.prototype, "permissions", permissions);
}
