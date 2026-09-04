import { setLocationComponent } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHostname = Object.getOwnPropertyDescriptor({
  set hostname(value) {
    requireLocation(this);
    setLocationComponent("hostname", value);
    traceCall("window.location.hostname", "Location", [value], undefined);
  },
}, "hostname").set;

registerNativeFunction(locationHostname, "set hostname");
