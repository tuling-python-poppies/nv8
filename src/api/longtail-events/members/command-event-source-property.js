import * as runtime from "../longtail-events-runtime.js";
import { CommandEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    CommandEvent,
    "source",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
