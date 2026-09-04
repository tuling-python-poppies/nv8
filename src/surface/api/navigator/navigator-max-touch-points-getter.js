import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const maxTouchPoints = Object.getOwnPropertyDescriptor({
  get maxTouchPoints() {
    const value = navigatorField(this, "maxTouchPoints");
    traceGetter("window.Navigator.prototype.maxTouchPoints", "Navigator", value);
    return value;
  },
}, "maxTouchPoints").get;
registerNativeGetter(maxTouchPoints, "maxTouchPoints");
export function installNavigatorMaxTouchPoints() {
  definePrototypeGetter(Navigator.prototype, "maxTouchPoints", maxTouchPoints);
}
