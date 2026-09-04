import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const storage = Object.getOwnPropertyDescriptor({
  get storage() {
    const value = navigatorService(this, "storage");
    traceGetter("window.Navigator.prototype.storage", "Navigator", value);
    return value;
  },
}, "storage").get;
registerNativeGetter(storage, "storage");
export function installNavigatorStorage() {
  definePrototypeGetter(Navigator.prototype, "storage", storage);
}
