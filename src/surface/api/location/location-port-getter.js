import { currentUrlRecord } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationPort = Object.getOwnPropertyDescriptor({
  get port() {
    requireLocation(this);
    const value = currentUrlRecord().port;
    traceGetter("window.location.port", "Location", value);
    return value;
  },
}, "port").get;

registerNativeGetter(locationPort, "port");
