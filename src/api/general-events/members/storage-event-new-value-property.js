import * as runtime from "../general-events-runtime.js";
import { StorageEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    StorageEvent,
    "newValue",
    runtime.generalEventProperty,
    null,
    false,
  );
}
