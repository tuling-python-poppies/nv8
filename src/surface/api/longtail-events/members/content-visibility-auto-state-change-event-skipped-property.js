import * as runtime from "../longtail-events-runtime.js";
import { ContentVisibilityAutoStateChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    ContentVisibilityAutoStateChangeEvent,
    "skipped",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
