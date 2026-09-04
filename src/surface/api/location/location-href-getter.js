import { currentHref } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
