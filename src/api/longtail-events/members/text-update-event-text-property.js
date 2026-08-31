import * as runtime from "../longtail-events-runtime.js";
import { TextUpdateEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    TextUpdateEvent,
    "text",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
