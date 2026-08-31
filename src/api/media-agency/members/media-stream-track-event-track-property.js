import * as runtime from "../media-agency-runtime.js";
import { MediaStreamTrackEvent } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MediaStreamTrackEvent,
    "track",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}
