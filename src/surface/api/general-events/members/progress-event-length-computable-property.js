import * as runtime from "../general-events-runtime.js";
import { ProgressEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ProgressEvent,
    "lengthComputable",
    runtime.generalEventProperty,
    null,
    false,
  );
}
