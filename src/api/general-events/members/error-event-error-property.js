import * as runtime from "../general-events-runtime.js";
import { ErrorEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ErrorEvent,
    "error",
    runtime.generalEventProperty,
    null,
    false,
  );
}
