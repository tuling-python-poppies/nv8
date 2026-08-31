import { currentUrlRecord } from "../../navigation/navigation-state.js";
import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationProtocol = Object.getOwnPropertyDescriptor({
  get protocol() {
    requireLocation(this);
    const value = currentUrlRecord().protocol;
    traceGetter("window.location.protocol", "Location", value);
    return value;
  },
}, "protocol").get;

registerNativeGetter(locationProtocol, "protocol");
