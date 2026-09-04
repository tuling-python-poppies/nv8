import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const host = Object.getOwnPropertyDescriptor({
  set host(value) {
    writeURLComponent(this, "host", value);
    traceCall("window.URL.prototype.host", "URL", [value], undefined);
  },
}, "host").set;
registerNativeFunction(host, "set host");
