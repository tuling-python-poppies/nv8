import { currentOrigin } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationOrigin = Object.getOwnPropertyDescriptor({
  get origin() {
    requireLocation(this);
    const value = currentOrigin();
    traceGetter("window.location.origin", "Location", value);
    return value;
  },
}, "origin").get;

registerNativeGetter(locationOrigin, "origin");
