import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cookieStoreDelete } from "./cookie-state.js";
import { requireCookieStore } from "./cookie-store-state.js";
export const deleteCookie = { async delete(options) {
  requireCookieStore(this);
  cookieStoreDelete(options);
  traceCall("window.CookieStore.prototype.delete", "CookieStore", [options], undefined);
}}.delete;
registerNativeFunction(deleteCookie, "delete");
