import { currentUrlRecord } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHost = Object.getOwnPropertyDescriptor({
  get host() {
    requireLocation(this);
    const value = currentUrlRecord().host;
    traceGetter("window.location.host", "Location", value);
    return value;
  },
}, "host").get;

registerNativeGetter(locationHost, "host");
