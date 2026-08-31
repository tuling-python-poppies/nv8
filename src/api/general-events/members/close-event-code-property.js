import * as runtime from "../general-events-runtime.js";
import { CloseEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    CloseEvent,
    "code",
    runtime.generalEventProperty,
    null,
    false,
  );
}
