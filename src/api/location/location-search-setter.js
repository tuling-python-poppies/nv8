import { setLocationComponent } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationSearch = Object.getOwnPropertyDescriptor({
  set search(value) {
    requireLocation(this);
    setLocationComponent("search", value);
    traceCall("window.location.search", "Location", [value], undefined);
  },
}, "search").set;

registerNativeFunction(locationSearch, "set search");
