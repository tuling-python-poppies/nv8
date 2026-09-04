import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const protocol = Object.getOwnPropertyDescriptor({
  set protocol(value) {
    writeURLComponent(this, "protocol", value);
    traceCall("window.URL.prototype.protocol", "URL", [value], undefined);
  },
}, "protocol").set;
registerNativeFunction(protocol, "set protocol");
