import * as runtime from "../longtail-events-runtime.js";
import { CharacterBoundsUpdateEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    CharacterBoundsUpdateEvent,
    "rangeEnd",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
