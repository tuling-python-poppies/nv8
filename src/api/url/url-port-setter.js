import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const port = Object.getOwnPropertyDescriptor({
  set port(value) {
    writeURLComponent(this, "port", value);
    traceCall("window.URL.prototype.port", "URL", [value], undefined);
  },
}, "port").set;
registerNativeFunction(port, "set port");
