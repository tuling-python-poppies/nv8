import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const login = Object.getOwnPropertyDescriptor({
  get login() {
    const value = navigatorService(this, "login");
    traceGetter("window.Navigator.prototype.login", "Navigator", value);
    return value;
  },
}, "login").get;
registerNativeGetter(login, "login");
export function installNavigatorLogin() {
  definePrototypeGetter(Navigator.prototype, "login", login);
}
