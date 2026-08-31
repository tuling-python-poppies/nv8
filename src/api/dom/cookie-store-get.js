import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cookieStoreGet } from "./cookie-state.js";
import { requireCookieStore } from "./cookie-store-state.js";
export const get = { async get() {
  requireCookieStore(this);
  const options = arguments[0];
  const result = cookieStoreGet(options);
  traceCall("window.CookieStore.prototype.get", "CookieStore", [options], result);
  return result;
}}.get;
registerNativeFunction(get, "get");
