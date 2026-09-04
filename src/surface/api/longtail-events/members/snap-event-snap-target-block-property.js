import * as runtime from "../longtail-events-runtime.js";
import { SnapEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    SnapEvent,
    "snapTargetBlock",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
