import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { CustomEvent } from "./custom-event-constructor.js";
import { requireCustomEvent } from "./custom-event-state.js";

export const customEventDetail = {
  customEventDetail() {
  const value = requireCustomEvent(this).detail;
  traceGetter("window.CustomEvent.prototype.detail", "CustomEvent", value);
  return value;

  },
}.customEventDetail;

registerNativeGetter(customEventDetail, "detail");

export function installCustomEventDetail() {
  definePrototypeGetter(CustomEvent.prototype, "detail", customEventDetail);
}
