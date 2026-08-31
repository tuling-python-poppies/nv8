import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const port = Object.getOwnPropertyDescriptor({
  get port() {
    const value = readURLComponent(this, "port");
    traceGetter("window.URL.prototype.port", "URL", value);
    return value;
  },
}, "port").get;
registerNativeGetter(port, "port");
