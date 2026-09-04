import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const pathname = Object.getOwnPropertyDescriptor({
  set pathname(value) {
    writeURLComponent(this, "pathname", value);
    traceCall("window.URL.prototype.pathname", "URL", [value], undefined);
  },
}, "pathname").set;
registerNativeFunction(pathname, "set pathname");
