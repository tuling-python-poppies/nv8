import * as runtime from "../webrtc-runtime.js";
import { RTCEncodedAudioFrame } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCEncodedAudioFrame);
}

export function installRelation() {
  installDispatchedRelation(
    RTCEncodedAudioFrame,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCEncodedAudioFrame,
    "timestamp",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCEncodedAudioFrame,
    "data",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    RTCEncodedAudioFrame,
    "getMetadata",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    RTCEncodedAudioFrame,
    "toString",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCEncodedAudioFrame);
}

export function installTag() {
  installDispatchedTag(RTCEncodedAudioFrame);
}
