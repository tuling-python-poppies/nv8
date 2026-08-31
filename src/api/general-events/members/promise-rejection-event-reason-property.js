import * as runtime from "../general-events-runtime.js";
import { PromiseRejectionEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PromiseRejectionEvent,
    "reason",
    runtime.generalEventProperty,
    null,
    false,
  );
}
