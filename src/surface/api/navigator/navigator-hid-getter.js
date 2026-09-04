import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
