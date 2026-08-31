import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const password = Object.getOwnPropertyDescriptor({
  set password(value) {
    writeURLComponent(this, "password", value);
    traceCall("window.URL.prototype.password", "URL", [value], undefined);
  },
}, "password").set;
registerNativeFunction(password, "set password");
