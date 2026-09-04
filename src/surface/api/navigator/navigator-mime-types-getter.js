import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const mimeTypes = Object.getOwnPropertyDescriptor({
  get mimeTypes() {
    const value = navigatorService(this, "mimeTypes");
    traceGetter("window.Navigator.prototype.mimeTypes", "Navigator", value);
    return value;
  },
}, "mimeTypes").get;
registerNativeGetter(mimeTypes, "mimeTypes");
export function installNavigatorMimeTypes() {
  definePrototypeGetter(Navigator.prototype, "mimeTypes", mimeTypes);
}
