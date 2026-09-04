import * as runtime from "../general-events-runtime.js";
import { PromiseRejectionEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PromiseRejectionEvent,
    "promise",
    runtime.generalEventProperty,
    null,
    false,
  );
}
