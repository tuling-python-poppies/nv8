import { setLocationComponent } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationPathname = Object.getOwnPropertyDescriptor({
  set pathname(value) {
    requireLocation(this);
    setLocationComponent("pathname", value);
    traceCall("window.location.pathname", "Location", [value], undefined);
  },
}, "pathname").set;

registerNativeFunction(locationPathname, "set pathname");
