import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Screen } from "./screen-constructor.js";
import { requireScreen } from "./screen-state.js";

export const screenIsExtended = Object.getOwnPropertyDescriptor({
  get isExtended() {
    const value = requireScreen(this).isExtended;
    traceGetter("window.Screen.prototype.isExtended", "Screen", value);
    return value;
  },
}, "isExtended").get;

registerNativeGetter(screenIsExtended, "isExtended");

export function installScreenIsExtended() {
  definePrototypeGetter(Screen.prototype, "isExtended", screenIsExtended);
}
