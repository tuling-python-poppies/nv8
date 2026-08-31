import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const doNotTrack = Object.getOwnPropertyDescriptor({
  get doNotTrack() {
    const value = navigatorField(this, "doNotTrack");
    traceGetter("window.Navigator.prototype.doNotTrack", "Navigator", value);
    return value;
  },
}, "doNotTrack").get;
registerNativeGetter(doNotTrack, "doNotTrack");
export function installNavigatorDoNotTrack() {
  definePrototypeGetter(Navigator.prototype, "doNotTrack", doNotTrack);
}
