import * as runtime from "../longtail-events-runtime.js";
import { PresentationConnectionCloseEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PresentationConnectionCloseEvent,
    "message",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
