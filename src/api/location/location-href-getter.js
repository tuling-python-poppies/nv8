import { currentHref } from "../../navigation/navigation-state.js";
import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHref = Object.getOwnPropertyDescriptor({
  get href() {
    requireLocation(this);
    const value = currentHref();
    traceGetter("window.location.href", "Location", value);
    return value;
  },
}, "href").get;

registerNativeGetter(locationHref, "href");
