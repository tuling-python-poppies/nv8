import * as runtime from "../webrtc-runtime.js";
import { RTCRtpSender } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCRtpSender);
}

export function installRelation() {
  installDispatchedRelation(
    RTCRtpSender,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCRtpSender,
    "track",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCRtpSender,
    "transport",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCRtpSender,
    "rtcpTransport",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCRtpSender,
    "dtmf",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    RTCRtpSender,
    "createEncodedStreams",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    RTCRtpSender,
    "getParameters",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    RTCRtpSender,
    "getStats",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    RTCRtpSender,
    "replaceTrack",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    RTCRtpSender,
    "setParameters",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    RTCRtpSender,
    "setStreams",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    RTCRtpSender,
    "transform",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCRtpSender);
}

export function installTag() {
  installDispatchedTag(RTCRtpSender);
}
