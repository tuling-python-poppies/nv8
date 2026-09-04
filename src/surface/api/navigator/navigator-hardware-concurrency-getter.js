import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorField } from "./navigator-state.js";

export const hardwareConcurrency = Object.getOwnPropertyDescriptor({
  get hardwareConcurrency() {
    const value = navigatorField(this, "hardwareConcurrency");
    traceGetter(
      "window.Navigator.prototype.hardwareConcurrency",
      "Navigator",
      value,
    );
    return value;
  },
}, "hardwareConcurrency").get;
registerNativeGetter(hardwareConcurrency, "hardwareConcurrency");
export function installNavigatorHardwareConcurrency() {
  definePrototypeGetter(
    Navigator.prototype,
    "hardwareConcurrency",
    hardwareConcurrency,
  );
}
