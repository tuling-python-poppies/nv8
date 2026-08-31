import * as runtime from "../webrtc-runtime.js";
import { RTCPeerConnectionIceErrorEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCPeerConnectionIceErrorEvent,
    "hostCandidate",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
