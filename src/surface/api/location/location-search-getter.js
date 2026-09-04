import { currentUrlRecord } from "../../../infra/navigation/navigation-state.js";
import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationSearch = Object.getOwnPropertyDescriptor({
  get search() {
    requireLocation(this);
    const value = currentUrlRecord().search;
    traceGetter("window.location.search", "Location", value);
    return value;
  },
}, "search").get;

registerNativeGetter(locationSearch, "search");
