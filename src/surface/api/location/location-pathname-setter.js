import { setLocationComponent } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationPathname = Object.getOwnPropertyDescriptor({
  set pathname(value) {
    requireLocation(this);
    setLocationComponent("pathname", value);
    traceCall("window.location.pathname", "Location", [value], undefined);
  },
}, "pathname").set;

registerNativeFunction(locationPathname, "set pathname");
