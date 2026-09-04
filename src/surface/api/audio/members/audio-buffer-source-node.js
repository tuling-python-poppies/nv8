import * as runtime from "../audio-runtime.js";
import { AudioBufferSourceNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioBufferSourceNode);
}

export function installRelation() {
  installDispatchedRelation(
    AudioBufferSourceNode,
    "AudioScheduledSourceNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioBufferSourceNode,
    "buffer",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioBufferSourceNode,
    "playbackRate",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioBufferSourceNode,
    "detune",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    AudioBufferSourceNode,
    "loop",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    AudioBufferSourceNode,
    "loopStart",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    AudioBufferSourceNode,
    "loopEnd",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AudioBufferSourceNode,
    "start",
    0,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioBufferSourceNode);
}

export function installTag() {
  installDispatchedTag(AudioBufferSourceNode);
}
