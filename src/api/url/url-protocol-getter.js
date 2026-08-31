import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const protocol = Object.getOwnPropertyDescriptor({
  get protocol() {
    const value = readURLComponent(this, "protocol");
    traceGetter("window.URL.prototype.protocol", "URL", value);
    return value;
  },
}, "protocol").get;
registerNativeGetter(protocol, "protocol");
