import * as runtime from "../general-events-runtime.js";
import { MediaQueryListEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MediaQueryListEvent,
    "matches",
    runtime.generalEventProperty,
    null,
    false,
  );
}
