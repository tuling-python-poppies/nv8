import { navigate } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export const globalLocation = Object.getOwnPropertyDescriptor({
  set location(value) {
    navigate(`${value}`, "assign");
    traceCall("window.location", "Window", [value], undefined);
  },
}, "location").set;

registerNativeFunction(globalLocation, "set location");
