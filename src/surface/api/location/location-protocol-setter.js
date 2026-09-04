import { setLocationComponent } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationProtocol = Object.getOwnPropertyDescriptor({
  set protocol(value) {
    requireLocation(this);
    setLocationComponent("protocol", value);
    traceCall("window.location.protocol", "Location", [value], undefined);
  },
}, "protocol").set;

registerNativeFunction(locationProtocol, "set protocol");
