import { setLocationComponent } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationPort = Object.getOwnPropertyDescriptor({
  set port(value) {
    requireLocation(this);
    setLocationComponent("port", value);
    traceCall("window.location.port", "Location", [value], undefined);
  },
}, "port").set;

registerNativeFunction(locationPort, "set port");
