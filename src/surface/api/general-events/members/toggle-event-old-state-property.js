import * as runtime from "../general-events-runtime.js";
import { ToggleEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ToggleEvent,
    "oldState",
    runtime.generalEventProperty,
    null,
    false,
  );
}
