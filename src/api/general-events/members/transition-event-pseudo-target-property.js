import * as runtime from "../general-events-runtime.js";
import { TransitionEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    TransitionEvent,
    "pseudoTarget",
    runtime.generalEventProperty,
    null,
    false,
  );
}
