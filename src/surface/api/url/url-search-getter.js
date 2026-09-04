import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const search = Object.getOwnPropertyDescriptor({
  get search() {
    const value = readURLComponent(this, "search");
    traceGetter("window.URL.prototype.search", "URL", value);
    return value;
  },
}, "search").get;
registerNativeGetter(search, "search");
