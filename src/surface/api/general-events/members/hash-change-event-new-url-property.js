import * as runtime from "../general-events-runtime.js";
import { HashChangeEvent } from "../general-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    HashChangeEvent,
    "newURL",
    runtime.generalEventProperty,
    null,
    false,
  );
}
