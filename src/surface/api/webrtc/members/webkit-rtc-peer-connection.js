import { RTCPeerConnection as Constructor } from "../webrtc-runtime.js";
import { installDispatchedGlobal } from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(
    Constructor,
    "webkitRTCPeerConnection",
    false,
  );
}
