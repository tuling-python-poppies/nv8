import * as runtime from "../longtail-events-runtime.js";
import { ClipboardChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ClipboardChangeEvent,
    "changeId",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
