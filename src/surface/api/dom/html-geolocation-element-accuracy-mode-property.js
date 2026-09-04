import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireGeolocationElement } from "./html-geolocation-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get accuracymode() {
    const result = requireGeolocationElement(this).accuracymode;
    traceGetter("window.HTMLGeolocationElement.prototype.accuracymode", "HTMLGeolocationElement", result);
    return result;
  },
  set accuracymode(value) {
    requireGeolocationElement(this).accuracymode = `${value}`;
  },
}, "accuracymode");
export const accuracymode = descriptor.get;
export const setAccuracymode = descriptor.set;
registerNativeGetter(accuracymode, "accuracymode");
registerNativeFunction(setAccuracymode, "set accuracymode");
