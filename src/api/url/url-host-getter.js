import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const host = Object.getOwnPropertyDescriptor({
  get host() {
    const value = readURLComponent(this, "host");
    traceGetter("window.URL.prototype.host", "URL", value);
    return value;
  },
}, "host").get;
registerNativeGetter(host, "host");
