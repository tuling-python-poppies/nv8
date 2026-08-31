import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { URL } from "./url-constructor.js";
import { revokeObjectURL as revoke } from "./url-state.js";

export const revokeObjectURL = {
  revokeObjectURL(url) {
    if (arguments.length === 0) {
      throw new TypeError("URL.revokeObjectURL requires 1 argument");
    }
    revoke(url);
    traceCall("window.URL.revokeObjectURL", "URL", [url], undefined);
  },
}.revokeObjectURL;
registerNativeFunction(revokeObjectURL, "revokeObjectURL");
export function installURLRevokeObjectURL() {
  definePrototypeMethod(URL, "revokeObjectURL", revokeObjectURL);
}
