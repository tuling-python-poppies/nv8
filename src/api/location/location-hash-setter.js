import { setLocationComponent } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationHash = Object.getOwnPropertyDescriptor({
  set hash(value) {
    requireLocation(this);
    setLocationComponent("hash", value);
    traceCall("window.location.hash", "Location", [value], undefined);
  },
}, "hash").set;

registerNativeFunction(locationHash, "set hash");
