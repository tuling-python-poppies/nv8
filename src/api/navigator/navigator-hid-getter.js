import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const hid = Object.getOwnPropertyDescriptor({
  get hid() {
    const value = navigatorService(this, "hid");
    traceGetter("window.Navigator.prototype.hid", "Navigator", value);
    return value;
  },
}, "hid").get;
registerNativeGetter(hid, "hid");
export function installNavigatorHid() {
  definePrototypeGetter(Navigator.prototype, "hid", hid);
}
