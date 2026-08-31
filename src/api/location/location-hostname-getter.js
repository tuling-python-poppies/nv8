import { currentUrlRecord } from "../../navigation/navigation-state.js";
import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
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
