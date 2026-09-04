import * as runtime from "../general-events-runtime.js";
import { TransitionEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    TransitionEvent,
    "propertyName",
    runtime.generalEventProperty,
    null,
    false,
  );
}
