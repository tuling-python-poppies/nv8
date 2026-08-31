import * as runtime from "../longtail-events-runtime.js";
import { SecurityPolicyViolationEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    SecurityPolicyViolationEvent,
    "documentURI",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
