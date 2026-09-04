import * as runtime from "../webrtc-runtime.js";
import { RTCRtpTransceiver } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCRtpTransceiver);
}

export function installRelation() {
  installDispatchedRelation(
    RTCRtpTransceiver,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCRtpTransceiver,
    "mid",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCRtpTransceiver,
    "sender",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCRtpTransceiver,
    "receiver",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCRtpTransceiver,
    "stopped",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    RTCRtpTransceiver,
    "direction",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    RTCRtpTransceiver,
    "currentDirection",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    RTCRtpTransceiver,
    "getHeaderExtensionsToNegotiate",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    RTCRtpTransceiver,
    "getNegotiatedHeaderExtensions",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    RTCRtpTransceiver,
    "setCodecPreferences",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    RTCRtpTransceiver,
    "setHeaderExtensionsToNegotiate",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    RTCRtpTransceiver,
    "stop",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCRtpTransceiver);
}

export function installTag() {
  installDispatchedTag(RTCRtpTransceiver);
}
