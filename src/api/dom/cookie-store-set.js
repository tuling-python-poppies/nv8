import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { cookieStoreSet } from "./cookie-state.js";
import { requireCookieStore } from "./cookie-store-state.js";
export const set = { async set(nameOrOptions) {
  requireCookieStore(this);
  cookieStoreSet(nameOrOptions, arguments[1]);
  traceCall("window.CookieStore.prototype.set", "CookieStore", [nameOrOptions], undefined);
}}.set;
registerNativeFunction(set, "set");
