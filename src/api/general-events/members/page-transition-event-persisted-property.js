import * as runtime from "../general-events-runtime.js";
import { PageTransitionEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PageTransitionEvent,
    "persisted",
    runtime.generalEventProperty,
    null,
    false,
  );
}
