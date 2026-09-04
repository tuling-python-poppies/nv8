import * as runtime from "../general-events-runtime.js";
import { AnimationEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    AnimationEvent,
    "animation",
    runtime.generalEventProperty,
    null,
    false,
  );
}
