import * as runtime from "../general-events-runtime.js";
import { StorageEvent } from "../general-events-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    StorageEvent,
    "initStorageEvent",
    1,
    runtime.generalEventOperation,
  );
}
