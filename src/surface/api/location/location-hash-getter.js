import { currentUrlRecord } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHash = Object.getOwnPropertyDescriptor({
  get hash() {
    requireLocation(this);
    const value = currentUrlRecord().hash;
    traceGetter("window.location.hash", "Location", value);
    return value;
  },
}, "hash").get;

registerNativeGetter(locationHash, "hash");
