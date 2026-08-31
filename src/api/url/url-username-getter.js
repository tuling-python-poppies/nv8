import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const username = Object.getOwnPropertyDescriptor({
  get username() {
    const value = readURLComponent(this, "username");
    traceGetter("window.URL.prototype.username", "URL", value);
    return value;
  },
}, "username").get;
registerNativeGetter(username, "username");
