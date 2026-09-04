import * as runtime from "../audio-runtime.js";
import { OscillatorNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(OscillatorNode);
}

export function installRelation() {
  installDispatchedRelation(
    OscillatorNode,
    "AudioScheduledSourceNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    OscillatorNode,
    "type",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    OscillatorNode,
    "frequency",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    OscillatorNode,
    "detune",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    OscillatorNode,
    "setPeriodicWave",
    1,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(OscillatorNode);
}

export function installTag() {
  installDispatchedTag(OscillatorNode);
}
