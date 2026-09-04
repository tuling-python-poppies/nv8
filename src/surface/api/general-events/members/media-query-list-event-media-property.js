import * as runtime from "../general-events-runtime.js";
import { MediaQueryListEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MediaQueryListEvent,
    "media",
    runtime.generalEventProperty,
    null,
    false,
  );
}
