import * as runtime from "../webrtc-runtime.js";
import { RTCDtlsTransport } from "../webrtc-runtime.js";
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
  installDispatchedGlobal(RTCDtlsTransport);
}

export function installRelation() {
  installDispatchedRelation(
    RTCDtlsTransport,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCDtlsTransport,
    "iceTransport",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCDtlsTransport,
    "state",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCDtlsTransport,
    "onstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCDtlsTransport,
    "onerror",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    RTCDtlsTransport,
    "getRemoteCertificates",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCDtlsTransport);
}

export function installTag() {
  installDispatchedTag(RTCDtlsTransport);
}
