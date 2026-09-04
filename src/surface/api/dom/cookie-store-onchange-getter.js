import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireCookieStore } from "./cookie-store-state.js";
export const onchange = Object.getOwnPropertyDescriptor({ get onchange() {
  const value = requireCookieStore(this).onchange;
  traceGetter("window.CookieStore.prototype.onchange", "CookieStore", value);
  return value;
}}, "onchange").get;
registerNativeGetter(onchange, "onchange");
