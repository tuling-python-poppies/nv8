import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const presentation = Object.getOwnPropertyDescriptor({
  get presentation() {
    const value = navigatorService(this, "presentation");
    traceGetter("window.Navigator.prototype.presentation", "Navigator", value);
    return value;
  },
}, "presentation").get;
registerNativeGetter(presentation, "presentation");
export function installNavigatorPresentation() {
  definePrototypeGetter(Navigator.prototype, "presentation", presentation);
}
