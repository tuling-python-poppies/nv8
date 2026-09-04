import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { currentScreen } from "./screen-state.js";

export const globalScreen = Object.getOwnPropertyDescriptor({
  get screen() {
    const value = currentScreen();
    traceGetter("window.screen", "Window", value);
    return value;
  },
}, "screen").get;

registerNativeGetter(globalScreen, "screen");

export function installGlobalScreen() {
  currentScreen();
  Object.defineProperty(globalThis, "screen", {
    get: globalScreen,
    enumerable: true,
    configurable: true,
  });
}
