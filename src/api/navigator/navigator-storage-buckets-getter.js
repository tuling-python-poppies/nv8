import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const storageBuckets = Object.getOwnPropertyDescriptor({
  get storageBuckets() {
    const value = navigatorService(this, "storageBuckets");
    traceGetter("window.Navigator.prototype.storageBuckets", "Navigator", value);
    return value;
  },
}, "storageBuckets").get;
registerNativeGetter(storageBuckets, "storageBuckets");
export function installNavigatorStorageBuckets() {
  definePrototypeGetter(Navigator.prototype, "storageBuckets", storageBuckets);
}
