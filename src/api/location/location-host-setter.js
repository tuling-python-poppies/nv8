import { setLocationComponent } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHost = Object.getOwnPropertyDescriptor({
  set host(value) {
    requireLocation(this);
    setLocationComponent("host", value);
    traceCall("window.location.host", "Location", [value], undefined);
  },
}, "host").set;

registerNativeFunction(locationHost, "set host");
