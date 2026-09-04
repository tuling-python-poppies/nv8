import * as runtime from "../webrtc-runtime.js";
import { RTCErrorEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCErrorEvent,
    "error",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
