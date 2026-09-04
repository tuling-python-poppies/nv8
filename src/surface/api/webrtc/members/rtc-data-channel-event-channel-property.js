import * as runtime from "../webrtc-runtime.js";
import { RTCDataChannelEvent } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    RTCDataChannelEvent,
    "channel",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}
