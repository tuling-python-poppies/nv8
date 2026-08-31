import { navigate } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const replace = {
  replace(url) {
    requireLocation(this);
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'replace' on 'Location': 1 argument required.",
      );
    }
    navigate(`${url}`, "replace");
    traceCall("window.location.replace", "Location", [url], undefined);
  },
}.replace;

registerNativeFunction(replace, "replace");
