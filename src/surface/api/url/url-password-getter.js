import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { readURLComponent } from "./url-state.js";

export const password = Object.getOwnPropertyDescriptor({
  get password() {
    const value = readURLComponent(this, "password");
    traceGetter("window.URL.prototype.password", "URL", value);
    return value;
  },
}, "password").get;
registerNativeGetter(password, "password");
