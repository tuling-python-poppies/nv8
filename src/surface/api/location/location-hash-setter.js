import { setLocationComponent } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHash = Object.getOwnPropertyDescriptor({
  set hash(value) {
    requireLocation(this);
    setLocationComponent("hash", value);
    traceCall("window.location.hash", "Location", [value], undefined);
  },
}, "hash").set;

registerNativeFunction(locationHash, "set hash");
