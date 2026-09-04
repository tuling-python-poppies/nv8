import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const origin = Object.getOwnPropertyDescriptor({
  get origin() {
    const value = readURLComponent(this, "origin");
    traceGetter("window.URL.prototype.origin", "URL", value);
    return value;
  },
}, "origin").get;
registerNativeGetter(origin, "origin");
