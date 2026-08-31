import * as runtime from "../longtail-events-runtime.js";
import { PresentationConnectionAvailableEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PresentationConnectionAvailableEvent,
    "connection",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
