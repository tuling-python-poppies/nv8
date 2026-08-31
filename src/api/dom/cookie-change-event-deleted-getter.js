import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCookieChangeEvent } from "./cookie-change-event-state.js";
export const deleted = Object.getOwnPropertyDescriptor({ get deleted() {
  const value = requireCookieChangeEvent(this).deleted;
  traceGetter("window.CookieChangeEvent.prototype.deleted", "CookieChangeEvent", value);
  return value;
}}, "deleted").get;
registerNativeGetter(deleted, "deleted");
