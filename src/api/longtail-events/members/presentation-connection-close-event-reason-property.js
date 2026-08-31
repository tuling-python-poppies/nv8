import * as runtime from "../longtail-events-runtime.js";
import { PresentationConnectionCloseEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PresentationConnectionCloseEvent,
    "reason",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
