import * as runtime from "../longtail-events-runtime.js";
import { PageRevealEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PageRevealEvent,
    "viewTransition",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
