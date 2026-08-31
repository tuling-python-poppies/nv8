import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { createLocation } from "./location-state.js";

export const globalLocation = Object.getOwnPropertyDescriptor({
  get location() {
    const value = createLocation();
    traceGetter("window.location", "Window", value);
    return value;
  },
}, "location").get;

registerNativeGetter(globalLocation, "location");
