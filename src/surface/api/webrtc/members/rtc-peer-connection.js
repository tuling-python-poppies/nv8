import * as runtime from "../webrtc-runtime.js";
import { RTCPeerConnection } from "../webrtc-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCPeerConnection);
}

export function installRelation() {
  installDispatchedRelation(
    RTCPeerConnection,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "localDescription",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "currentLocalDescription",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "pendingLocalDescription",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "remoteDescription",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "currentRemoteDescription",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "pendingRemoteDescription",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "signalingState",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "iceGatheringState",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "iceConnectionState",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "connectionState",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "canTrickleIceCandidates",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onnegotiationneeded",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onicecandidate",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onsignalingstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember14() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "oniceconnectionstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember15() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onconnectionstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember16() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onicegatheringstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember17() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onicecandidateerror",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember18() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "ontrack",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember19() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "sctp",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember20() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "ondatachannel",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember21() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onaddstream",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember22() {
  installDispatchedAccessor(
    RTCPeerConnection,
    "onremovestream",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember23() {
  installDispatchedMethod(
    RTCPeerConnection,
    "addIceCandidate",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember24() {
  installDispatchedMethod(
    RTCPeerConnection,
    "addStream",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember25() {
  installDispatchedMethod(
    RTCPeerConnection,
    "addTrack",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember26() {
  installDispatchedMethod(
    RTCPeerConnection,
    "addTransceiver",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember27() {
  installDispatchedMethod(
    RTCPeerConnection,
    "close",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember28() {
  installDispatchedMethod(
    RTCPeerConnection,
    "createAnswer",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember29() {
  installDispatchedMethod(
    RTCPeerConnection,
    "createDTMFSender",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember30() {
  installDispatchedMethod(
    RTCPeerConnection,
    "createDataChannel",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember31() {
  installDispatchedMethod(
    RTCPeerConnection,
    "createOffer",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember32() {
  installDispatchedMethod(
    RTCPeerConnection,
    "getConfiguration",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember33() {
  installDispatchedMethod(
    RTCPeerConnection,
    "getLocalStreams",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember34() {
  installDispatchedMethod(
    RTCPeerConnection,
    "getReceivers",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember35() {
  installDispatchedMethod(
    RTCPeerConnection,
    "getRemoteStreams",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember36() {
  installDispatchedMethod(
    RTCPeerConnection,
    "getSenders",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember37() {
  installDispatchedMethod(
    RTCPeerConnection,
    "getStats",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember38() {
  installDispatchedMethod(
    RTCPeerConnection,
    "getTransceivers",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember39() {
  installDispatchedMethod(
    RTCPeerConnection,
    "removeStream",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember40() {
  installDispatchedMethod(
    RTCPeerConnection,
    "removeTrack",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember41() {
  installDispatchedMethod(
    RTCPeerConnection,
    "restartIce",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember42() {
  installDispatchedMethod(
    RTCPeerConnection,
    "setConfiguration",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember43() {
  installDispatchedMethod(
    RTCPeerConnection,
    "setLocalDescription",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember44() {
  installDispatchedMethod(
    RTCPeerConnection,
    "setRemoteDescription",
    1,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCPeerConnection);
}

export function installTag() {
  installDispatchedTag(RTCPeerConnection);
}
