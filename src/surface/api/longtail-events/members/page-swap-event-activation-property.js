import * as runtime from "../longtail-events-runtime.js";
import { PageSwapEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PageSwapEvent,
    "activation",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
