import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceEventTiming } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PerformanceEventTiming,
    "interactionId",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}
