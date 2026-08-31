import * as runtime from "../webrtc-runtime.js";
import { RTCRtpScriptTransform } from "../webrtc-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCRtpScriptTransform);
}

export function installRelation() {
  installDispatchedRelation(
    RTCRtpScriptTransform,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCRtpScriptTransform);
}

export function installTag() {
  installDispatchedTag(RTCRtpScriptTransform);
}
