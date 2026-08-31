import * as runtime from "../webrtc-runtime.js";
import { RTCEncodedVideoFrame } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCEncodedVideoFrame);
}

export function installRelation() {
  installDispatchedRelation(
    RTCEncodedVideoFrame,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCEncodedVideoFrame,
    "type",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCEncodedVideoFrame,
    "timestamp",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCEncodedVideoFrame,
    "data",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    RTCEncodedVideoFrame,
    "getMetadata",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    RTCEncodedVideoFrame,
    "toString",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCEncodedVideoFrame);
}

export function installTag() {
  installDispatchedTag(RTCEncodedVideoFrame);
}
