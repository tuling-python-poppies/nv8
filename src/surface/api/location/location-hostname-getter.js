import { currentUrlRecord } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHostname = Object.getOwnPropertyDescriptor({
  get hostname() {
    requireLocation(this);
    const value = currentUrlRecord().hostname;
    traceGetter("window.location.hostname", "Location", value);
    return value;
  },
}, "hostname").get;

registerNativeGetter(locationHostname, "hostname");
