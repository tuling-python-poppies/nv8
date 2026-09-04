import * as runtime from "../longtail-events-runtime.js";
import { AnimationPlaybackEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    AnimationPlaybackEvent,
    "timelineTime",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
