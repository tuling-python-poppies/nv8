import * as runtime from "../general-events-runtime.js";
import { PopStateEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PopStateEvent,
    "state",
    runtime.generalEventProperty,
    null,
    false,
  );
}
