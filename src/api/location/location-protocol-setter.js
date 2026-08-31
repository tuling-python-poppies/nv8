import { setLocationComponent } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationProtocol = Object.getOwnPropertyDescriptor({
  set protocol(value) {
    requireLocation(this);
    setLocationComponent("protocol", value);
    traceCall("window.location.protocol", "Location", [value], undefined);
  },
}, "protocol").set;

registerNativeFunction(locationProtocol, "set protocol");
