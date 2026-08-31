import * as runtime from "../audio-runtime.js";
import { AudioScheduledSourceNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioScheduledSourceNode);
}

export function installRelation() {
  installDispatchedRelation(
    AudioScheduledSourceNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioScheduledSourceNode,
    "onended",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    AudioScheduledSourceNode,
    "start",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    AudioScheduledSourceNode,
    "stop",
    0,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioScheduledSourceNode);
}

export function installTag() {
  installDispatchedTag(AudioScheduledSourceNode);
}
