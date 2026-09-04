import * as runtime from "../longtail-events-runtime.js";
import { SecurityPolicyViolationEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    SecurityPolicyViolationEvent,
    "effectiveDirective",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
