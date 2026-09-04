import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const languages = Object.getOwnPropertyDescriptor({
  get languages() {
    const value = navigatorField(this, "languages");
    traceGetter("window.Navigator.prototype.languages", "Navigator", value);
    return value;
  },
}, "languages").get;
registerNativeGetter(languages, "languages");
export function installNavigatorLanguages() {
  definePrototypeGetter(Navigator.prototype, "languages", languages);
}
