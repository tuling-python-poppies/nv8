import * as runtime from "../webrtc-runtime.js";
import { RTCTrackEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCTrackEvent,
    "track",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
