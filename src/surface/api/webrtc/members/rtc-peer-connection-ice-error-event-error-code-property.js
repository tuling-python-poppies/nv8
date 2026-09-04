import * as runtime from "../webrtc-runtime.js";
import { RTCPeerConnectionIceErrorEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCPeerConnectionIceErrorEvent,
    "errorCode",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
