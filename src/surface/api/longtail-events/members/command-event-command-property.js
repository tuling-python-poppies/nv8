import * as runtime from "../longtail-events-runtime.js";
import { CommandEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    CommandEvent,
    "command",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
