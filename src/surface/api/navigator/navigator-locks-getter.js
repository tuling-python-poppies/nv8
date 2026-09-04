import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const locks = Object.getOwnPropertyDescriptor({
  get locks() {
    const value = navigatorService(this, "locks");
    traceGetter("window.Navigator.prototype.locks", "Navigator", value);
    return value;
  },
}, "locks").get;
registerNativeGetter(locks, "locks");
export function installNavigatorLocks() {
  definePrototypeGetter(Navigator.prototype, "locks", locks);
}
