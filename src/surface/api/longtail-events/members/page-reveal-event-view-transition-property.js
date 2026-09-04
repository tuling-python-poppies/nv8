import * as runtime from "../longtail-events-runtime.js";
import { PageRevealEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PageRevealEvent,
    "viewTransition",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
