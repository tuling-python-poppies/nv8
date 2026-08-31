import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const href = Object.getOwnPropertyDescriptor({
  set href(value) {
    writeURLComponent(this, "href", value);
    traceCall("window.URL.prototype.href", "URL", [value], undefined);
  },
}, "href").set;
registerNativeFunction(href, "set href");
