import { navigate } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const assign = {
  assign(url) {
    requireLocation(this);
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'assign' on 'Location': 1 argument required.",
      );
    }
    navigate(`${url}`, "assign");
    traceCall("window.location.assign", "Location", [url], undefined);
  },
}.assign;

registerNativeFunction(assign, "assign");
