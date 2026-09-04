import * as runtime from "../general-events-runtime.js";
import { TrackEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    TrackEvent,
    "track",
    runtime.generalEventProperty,
    null,
    false,
  );
}
