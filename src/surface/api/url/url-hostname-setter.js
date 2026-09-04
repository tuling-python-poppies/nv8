import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const hostname = Object.getOwnPropertyDescriptor({
  set hostname(value) {
    writeURLComponent(this, "hostname", value);
    traceCall("window.URL.prototype.hostname", "URL", [value], undefined);
  },
}, "hostname").set;
registerNativeFunction(hostname, "set hostname");
