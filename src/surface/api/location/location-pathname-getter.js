import { currentUrlRecord } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationPathname = Object.getOwnPropertyDescriptor({
  get pathname() {
    requireLocation(this);
    const value = currentUrlRecord().pathname;
    traceGetter("window.location.pathname", "Location", value);
    return value;
  },
}, "pathname").get;

registerNativeGetter(locationPathname, "pathname");
