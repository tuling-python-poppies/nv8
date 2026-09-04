import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const plugins = Object.getOwnPropertyDescriptor({
  get plugins() {
    const value = navigatorService(this, "plugins");
    traceGetter("window.Navigator.prototype.plugins", "Navigator", value);
    return value;
  },
}, "plugins").get;
registerNativeGetter(plugins, "plugins");
export function installNavigatorPlugins() {
  definePrototypeGetter(Navigator.prototype, "plugins", plugins);
}
