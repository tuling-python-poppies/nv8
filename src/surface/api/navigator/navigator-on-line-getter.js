import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const onLine = Object.getOwnPropertyDescriptor({
  get onLine() {
    const value = navigatorField(this, "onLine");
    traceGetter("window.Navigator.prototype.onLine", "Navigator", value);
    return value;
  },
}, "onLine").get;
registerNativeGetter(onLine, "onLine");
export function installNavigatorOnLine() {
  definePrototypeGetter(Navigator.prototype, "onLine", onLine);
}
