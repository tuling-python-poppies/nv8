import * as runtime from "../general-events-runtime.js";
import { ErrorEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ErrorEvent,
    "message",
    runtime.generalEventProperty,
    null,
    false,
  );
}
