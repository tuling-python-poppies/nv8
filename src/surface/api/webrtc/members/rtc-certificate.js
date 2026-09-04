import * as runtime from "../webrtc-runtime.js";
import { RTCCertificate } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCCertificate);
}

export function installRelation() {
  installDispatchedRelation(
    RTCCertificate,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCCertificate,
    "expires",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    RTCCertificate,
    "getFingerprints",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCCertificate);
}

export function installTag() {
  installDispatchedTag(RTCCertificate);
}
