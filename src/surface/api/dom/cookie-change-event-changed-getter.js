import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireCookieChangeEvent } from "./cookie-change-event-state.js";
export const changed = Object.getOwnPropertyDescriptor({ get changed() {
  const value = requireCookieChangeEvent(this).changed;
  traceGetter("window.CookieChangeEvent.prototype.changed", "CookieChangeEvent", value);
  return value;
}}, "changed").get;
registerNativeGetter(changed, "changed");
