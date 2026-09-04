import * as runtime from "../general-events-runtime.js";
import { CloseEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    CloseEvent,
    "wasClean",
    runtime.generalEventProperty,
    null,
    false,
  );
}
