import * as runtime from "../longtail-events-runtime.js";
import { CharacterBoundsUpdateEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    CharacterBoundsUpdateEvent,
    "rangeStart",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
