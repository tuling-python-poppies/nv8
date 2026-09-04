import * as runtime from "../general-events-runtime.js";
import { ErrorEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ErrorEvent,
    "colno",
    runtime.generalEventProperty,
    null,
    false,
  );
}
