import * as runtime from "../webrtc-runtime.js";
import { RTCDTMFToneChangeEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCDTMFToneChangeEvent,
    "tone",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
