import { setLocationComponent } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const locationPort = Object.getOwnPropertyDescriptor({
  set port(value) {
    requireLocation(this);
    setLocationComponent("port", value);
    traceCall("window.location.port", "Location", [value], undefined);
  },
}, "port").set;

registerNativeFunction(locationPort, "set port");
