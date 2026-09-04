import * as runtime from "../audio-runtime.js";
import { AudioWorkletNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioWorkletNode);
}

export function installRelation() {
  installDispatchedRelation(
    AudioWorkletNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioWorkletNode,
    "parameters",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioWorkletNode,
    "port",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioWorkletNode,
    "onprocessorerror",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioWorkletNode);
}

export function installTag() {
  installDispatchedTag(AudioWorkletNode);
}
