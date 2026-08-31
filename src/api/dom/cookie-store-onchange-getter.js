import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCookieStore } from "./cookie-store-state.js";
export const onchange = Object.getOwnPropertyDescriptor({ get onchange() {
  const value = requireCookieStore(this).onchange;
  traceGetter("window.CookieStore.prototype.onchange", "CookieStore", value);
  return value;
}}, "onchange").get;
registerNativeGetter(onchange, "onchange");
