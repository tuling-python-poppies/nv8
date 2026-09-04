import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const ink = Object.getOwnPropertyDescriptor({
  get ink() {
    const value = navigatorService(this, "ink");
    traceGetter("window.Navigator.prototype.ink", "Navigator", value);
    return value;
  },
}, "ink").get;
registerNativeGetter(ink, "ink");
export function installNavigatorInk() {
  definePrototypeGetter(Navigator.prototype, "ink", ink);
}
