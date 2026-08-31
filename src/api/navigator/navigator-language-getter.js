import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
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
