import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
let value = null;
export function setGlobalCookieStore(store) { value = store; }
export const cookieStore = Object.getOwnPropertyDescriptor({ get cookieStore() {
  traceGetter("window.cookieStore", "Window", value);
  return value;
}}, "cookieStore").get;
registerNativeGetter(cookieStore, "cookieStore");
