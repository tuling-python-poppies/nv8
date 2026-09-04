import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const hash = Object.getOwnPropertyDescriptor({
  get hash() {
    const value = readURLComponent(this, "hash");
    traceGetter("window.URL.prototype.hash", "URL", value);
    return value;
  },
}, "hash").get;
registerNativeGetter(hash, "hash");
