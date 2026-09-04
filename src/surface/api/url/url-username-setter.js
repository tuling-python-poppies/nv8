import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const username = Object.getOwnPropertyDescriptor({
  set username(value) {
    writeURLComponent(this, "username", value);
    traceCall("window.URL.prototype.username", "URL", [value], undefined);
  },
}, "username").set;
registerNativeFunction(username, "set username");
