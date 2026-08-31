import * as runtime from "../general-events-runtime.js";
import { SubmitEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    SubmitEvent,
    "submitter",
    runtime.generalEventProperty,
    null,
    false,
  );
}
