import { setLocationComponent } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHref = Object.getOwnPropertyDescriptor({
  set href(value) {
    requireLocation(this);
    setLocationComponent("href", value);
    traceCall("window.location.href", "Location", [value], undefined);
  },
}, "href").set;

registerNativeFunction(locationHref, "set href");
