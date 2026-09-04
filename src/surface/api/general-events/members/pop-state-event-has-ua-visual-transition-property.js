import * as runtime from "../general-events-runtime.js";
import { PopStateEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PopStateEvent,
    "hasUAVisualTransition",
    runtime.generalEventProperty,
    null,
    false,
  );
}
