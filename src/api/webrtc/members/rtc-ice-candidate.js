import * as runtime from "../webrtc-runtime.js";
import { RTCIceCandidate } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCIceCandidate);
}

export function installRelation() {
  installDispatchedRelation(
    RTCIceCandidate,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "candidate",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "sdpMid",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "sdpMLineIndex",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "foundation",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "component",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "priority",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "address",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "protocol",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "port",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "type",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "tcpType",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "relatedAddress",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "relatedPort",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "usernameFragment",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember14() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "relayProtocol",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember15() {
  installDispatchedAccessor(
    RTCIceCandidate,
    "url",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember16() {
  installDispatchedMethod(
    RTCIceCandidate,
    "toJSON",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCIceCandidate);
}

export function installTag() {
  installDispatchedTag(RTCIceCandidate);
}
