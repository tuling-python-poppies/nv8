import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const windowControlsOverlay = Object.getOwnPropertyDescriptor({
  get windowControlsOverlay() {
    const value = navigatorService(this, "windowControlsOverlay");
    traceGetter(
      "window.Navigator.prototype.windowControlsOverlay",
      "Navigator",
      value,
    );
    return value;
  },
}, "windowControlsOverlay").get;
registerNativeGetter(windowControlsOverlay, "windowControlsOverlay");
export function installNavigatorWindowControlsOverlay() {
  definePrototypeGetter(
    Navigator.prototype,
    "windowControlsOverlay",
    windowControlsOverlay,
  );
}
