import * as runtime from "../webrtc-runtime.js";
import { RTCRtpReceiver } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCRtpReceiver);
}

export function installRelation() {
  installDispatchedRelation(
    RTCRtpReceiver,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCRtpReceiver,
    "track",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCRtpReceiver,
    "transport",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCRtpReceiver,
    "rtcpTransport",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCRtpReceiver,
    "playoutDelayHint",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    RTCRtpReceiver,
    "createEncodedStreams",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    RTCRtpReceiver,
    "getContributingSources",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    RTCRtpReceiver,
    "getParameters",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    RTCRtpReceiver,
    "getStats",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    RTCRtpReceiver,
    "getSynchronizationSources",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    RTCRtpReceiver,
    "jitterBufferTarget",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    RTCRtpReceiver,
    "transform",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCRtpReceiver);
}

export function installTag() {
  installDispatchedTag(RTCRtpReceiver);
}
