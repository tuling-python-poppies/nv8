import * as runtime from "../webrtc-runtime.js";
import { RTCPeerConnectionIceErrorEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCPeerConnectionIceErrorEvent,
    "port",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
