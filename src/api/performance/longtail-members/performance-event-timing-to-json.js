import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceEventTiming } from "../performance-longtail-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    PerformanceEventTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}
