import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const managed = Object.getOwnPropertyDescriptor({
  get managed() {
    const value = navigatorService(this, "managed");
    traceGetter("window.Navigator.prototype.managed", "Navigator", value);
    return value;
  },
}, "managed").get;
registerNativeGetter(managed, "managed");
export function installNavigatorManaged() {
  definePrototypeGetter(Navigator.prototype, "managed", managed);
}
