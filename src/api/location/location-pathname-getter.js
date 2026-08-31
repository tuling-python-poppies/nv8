import { currentUrlRecord } from "../../navigation/navigation-state.js";
import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
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
