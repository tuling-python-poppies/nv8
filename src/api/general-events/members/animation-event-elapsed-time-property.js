import * as runtime from "../general-events-runtime.js";
import { AnimationEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    AnimationEvent,
    "elapsedTime",
    runtime.generalEventProperty,
    null,
    false,
  );
}
