import * as runtime from "../audio-runtime.js";
import { DynamicsCompressorNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DynamicsCompressorNode);
}

export function installRelation() {
  installDispatchedRelation(
    DynamicsCompressorNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    DynamicsCompressorNode,
    "threshold",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    DynamicsCompressorNode,
    "knee",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    DynamicsCompressorNode,
    "ratio",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    DynamicsCompressorNode,
    "reduction",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    DynamicsCompressorNode,
    "attack",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    DynamicsCompressorNode,
    "release",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DynamicsCompressorNode);
}

export function installTag() {
  installDispatchedTag(DynamicsCompressorNode);
}
