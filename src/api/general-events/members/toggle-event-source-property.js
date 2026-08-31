import * as runtime from "../general-events-runtime.js";
import { ToggleEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ToggleEvent,
    "source",
    runtime.generalEventProperty,
    null,
    false,
  );
}
