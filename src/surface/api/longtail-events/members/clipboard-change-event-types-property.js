import * as runtime from "../longtail-events-runtime.js";
import { ClipboardChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ClipboardChangeEvent,
    "types",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
