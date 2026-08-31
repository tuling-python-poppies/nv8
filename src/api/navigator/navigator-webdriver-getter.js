import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const webdriver = Object.getOwnPropertyDescriptor({
  get webdriver() {
    const value = navigatorField(this, "webdriver");
    traceGetter("window.Navigator.prototype.webdriver", "Navigator", value);
    return value;
  },
}, "webdriver").get;
registerNativeGetter(webdriver, "webdriver");
export function installNavigatorWebdriver() {
  definePrototypeGetter(Navigator.prototype, "webdriver", webdriver);
}
