import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const hash = Object.getOwnPropertyDescriptor({
  set hash(value) {
    writeURLComponent(this, "hash", value);
    traceCall("window.URL.prototype.hash", "URL", [value], undefined);
  },
}, "hash").set;
registerNativeFunction(hash, "set hash");
