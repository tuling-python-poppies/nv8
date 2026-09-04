import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const language = Object.getOwnPropertyDescriptor({
  get language() {
    const value = navigatorField(this, "language");
    traceGetter("window.Navigator.prototype.language", "Navigator", value);
    return value;
  },
}, "language").get;
registerNativeGetter(language, "language");
export function installNavigatorLanguage() {
  definePrototypeGetter(Navigator.prototype, "language", language);
}
