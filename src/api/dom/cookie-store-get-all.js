import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cookieStoreGetAll } from "./cookie-state.js";
import { requireCookieStore } from "./cookie-store-state.js";
export const getAll = { async getAll() {
  requireCookieStore(this);
  const options = arguments[0];
  const result = cookieStoreGetAll(options);
  traceCall("window.CookieStore.prototype.getAll", "CookieStore", [options], result);
  return result;
}}.getAll;
registerNativeFunction(getAll, "getAll");
