import * as runtime from "../webrtc-runtime.js";
import { RTCIceTransport } from "../webrtc-runtime.js";
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
  installDispatchedGlobal(RTCIceTransport);
}

export function installRelation() {
  installDispatchedRelation(
    RTCIceTransport,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCIceTransport,
    "role",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCIceTransport,
    "state",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCIceTransport,
    "gatheringState",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCIceTransport,
    "onstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    RTCIceTransport,
    "ongatheringstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    RTCIceTransport,
    "onselectedcandidatepairchange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    RTCIceTransport,
    "getLocalCandidates",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    RTCIceTransport,
    "getLocalParameters",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    RTCIceTransport,
    "getRemoteCandidates",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    RTCIceTransport,
    "getRemoteParameters",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    RTCIceTransport,
    "getSelectedCandidatePair",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCIceTransport);
}

export function installTag() {
  installDispatchedTag(RTCIceTransport);
}
