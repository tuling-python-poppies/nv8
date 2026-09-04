import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const scheduling = Object.getOwnPropertyDescriptor({
  get scheduling() {
    const value = navigatorService(this, "scheduling");
    traceGetter("window.Navigator.prototype.scheduling", "Navigator", value);
    return value;
  },
}, "scheduling").get;
registerNativeGetter(scheduling, "scheduling");
export function installNavigatorScheduling() {
  definePrototypeGetter(Navigator.prototype, "scheduling", scheduling);
}
