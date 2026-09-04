import * as runtime from "../audio-runtime.js";
import { AudioBuffer } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioBuffer);
}

export function installRelation() {
  installDispatchedRelation(
    AudioBuffer,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioBuffer,
    "length",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioBuffer,
    "duration",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioBuffer,
    "sampleRate",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    AudioBuffer,
    "numberOfChannels",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    AudioBuffer,
    "copyFromChannel",
    2,
    runtime.audioOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    AudioBuffer,
    "copyToChannel",
    2,
    runtime.audioOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AudioBuffer,
    "getChannelData",
    1,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioBuffer);
}

export function installTag() {
  installDispatchedTag(AudioBuffer);
}
