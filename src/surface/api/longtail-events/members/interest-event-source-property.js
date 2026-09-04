import * as runtime from "../longtail-events-runtime.js";
import { InterestEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    InterestEvent,
    "source",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
