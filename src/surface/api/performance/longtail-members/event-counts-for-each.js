import * as runtime from "../performance-longtail-runtime.js";
import { EventCounts } from "../performance-longtail-runtime.js";
import {
  installDispatchedMethod,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    EventCounts,
    "forEach",
    1,
    runtime.performanceLongtailOperation,
  );
}
