import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const hostname = Object.getOwnPropertyDescriptor({
  get hostname() {
    const value = readURLComponent(this, "hostname");
    traceGetter("window.URL.prototype.hostname", "URL", value);
    return value;
  },
}, "hostname").get;
registerNativeGetter(hostname, "hostname");
