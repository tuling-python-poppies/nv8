import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const search = Object.getOwnPropertyDescriptor({
  get search() {
    const value = readURLComponent(this, "search");
    traceGetter("window.URL.prototype.search", "URL", value);
    return value;
  },
}, "search").get;
registerNativeGetter(search, "search");
