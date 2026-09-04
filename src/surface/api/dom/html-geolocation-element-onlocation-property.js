import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get onlocation() {
    const result = requireGeolocationElement(this).onlocation;
    traceGetter("window.HTMLGeolocationElement.prototype.onlocation", "HTMLGeolocationElement", result);
    return result;
  },
  set onlocation(value) {
    requireGeolocationElement(this).onlocation =
      typeof value === "function" ? value : null;
  },
}, "onlocation");
export const onlocation = descriptor.get;
export const setOnlocation = descriptor.set;
registerNativeGetter(onlocation, "onlocation");
registerNativeFunction(setOnlocation, "set onlocation");
