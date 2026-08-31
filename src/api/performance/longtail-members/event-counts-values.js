import * as runtime from "../performance-longtail-runtime.js";
import { EventCounts } from "../performance-longtail-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    EventCounts,
    "values",
    0,
    runtime.performanceLongtailOperation,
  );
}
