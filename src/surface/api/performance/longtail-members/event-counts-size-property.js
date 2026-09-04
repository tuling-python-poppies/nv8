import * as runtime from "../performance-longtail-runtime.js";
import { EventCounts } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    EventCounts,
    "size",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}
