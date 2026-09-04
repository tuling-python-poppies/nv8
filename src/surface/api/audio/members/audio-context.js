import * as runtime from "../audio-runtime.js";
import { AudioContext } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioContext);
}

export function installRelation() {
  installDispatchedRelation(
    AudioContext,
    "BaseAudioContext",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioContext,
    "baseLatency",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioContext,
    "outputLatency",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioContext,
    "onerror",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    AudioContext,
    "close",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    AudioContext,
    "createMediaElementSource",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    AudioContext,
    "createMediaStreamDestination",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AudioContext,
    "createMediaStreamSource",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    AudioContext,
    "getOutputTimestamp",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    AudioContext,
    "resume",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    AudioContext,
    "suspend",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    AudioContext,
    "playbackStats",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioContext);
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    AudioContext,
    "sinkId",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    AudioContext,
    "onsinkchange",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember13() {
  installDispatchedMethod(
    AudioContext,
    "setSinkId",
    1,
    runtime.audioOperation,
  );
}

export function installTag() {
  installDispatchedTag(AudioContext);
}
