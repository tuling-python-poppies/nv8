import * as runtime from "../audio-runtime.js";
import { BiquadFilterNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BiquadFilterNode);
}

export function installRelation() {
  installDispatchedRelation(
    BiquadFilterNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BiquadFilterNode,
    "type",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BiquadFilterNode,
    "frequency",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BiquadFilterNode,
    "detune",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    BiquadFilterNode,
    "Q",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    BiquadFilterNode,
    "gain",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    BiquadFilterNode,
    "getFrequencyResponse",
    3,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BiquadFilterNode);
}

export function installTag() {
  installDispatchedTag(BiquadFilterNode);
}
