import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { createNavigator } from "./navigator-state.js";

export const globalNavigator = Object.getOwnPropertyDescriptor({
  get navigator() {
    const value = createNavigator();
    traceGetter("window.navigator", "Window", value);
    return value;
  },
}, "navigator").get;

registerNativeGetter(globalNavigator, "navigator");
