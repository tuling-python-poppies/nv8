import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceEventTiming } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PerformanceEventTiming,
    "processingEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}
