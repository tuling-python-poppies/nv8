import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const credentials = Object.getOwnPropertyDescriptor({
  get credentials() {
    const value = navigatorService(this, "credentials");
    traceGetter("window.Navigator.prototype.credentials", "Navigator", value);
    return value;
  },
}, "credentials").get;
registerNativeGetter(credentials, "credentials");
export function installNavigatorCredentials() {
  definePrototypeGetter(Navigator.prototype, "credentials", credentials);
}
