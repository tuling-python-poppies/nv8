import { setLocationComponent } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHref = Object.getOwnPropertyDescriptor({
  set href(value) {
    requireLocation(this);
    setLocationComponent("href", value);
    traceCall("window.location.href", "Location", [value], undefined);
  },
}, "href").set;

registerNativeFunction(locationHref, "set href");
