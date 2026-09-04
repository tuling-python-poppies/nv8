import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const pathname = Object.getOwnPropertyDescriptor({
  get pathname() {
    const value = readURLComponent(this, "pathname");
    traceGetter("window.URL.prototype.pathname", "URL", value);
    return value;
  },
}, "pathname").get;
registerNativeGetter(pathname, "pathname");
