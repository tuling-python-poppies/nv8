import * as runtime from "../webrtc-runtime.js";
import { RTCTrackEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCTrackEvent,
    "streams",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
