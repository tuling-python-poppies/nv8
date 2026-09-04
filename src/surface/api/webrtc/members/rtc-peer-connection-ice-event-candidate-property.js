import * as runtime from "../webrtc-runtime.js";
import { RTCPeerConnectionIceEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCPeerConnectionIceEvent,
    "candidate",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
