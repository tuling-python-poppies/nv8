import * as runtime from "../general-events-runtime.js";
import { FormDataEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    FormDataEvent,
    "formData",
    runtime.generalEventProperty,
    null,
    false,
  );
}
