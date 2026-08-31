import * as runtime from "../longtail-events-runtime.js";
import { BeforeUnloadEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    BeforeUnloadEvent,
    "returnValue",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    true,
  );
}
