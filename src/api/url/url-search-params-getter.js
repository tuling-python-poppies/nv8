import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const searchParams = Object.getOwnPropertyDescriptor({
  get searchParams() {
    const value = readURLComponent(this, "searchParams");
    traceGetter("window.URL.prototype.searchParams", "URL", value);
    return value;
  },
}, "searchParams").get;
registerNativeGetter(searchParams, "searchParams");
