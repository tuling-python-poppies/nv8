import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { writeURLComponent } from "./url-state.js";

export const search = Object.getOwnPropertyDescriptor({
  set search(value) {
    writeURLComponent(this, "search", value);
    traceCall("window.URL.prototype.search", "URL", [value], undefined);
  },
}, "search").set;
registerNativeFunction(search, "set search");
