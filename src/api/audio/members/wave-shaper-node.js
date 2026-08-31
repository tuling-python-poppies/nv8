import * as runtime from "../audio-runtime.js";
import { WaveShaperNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(WaveShaperNode);
}

export function installRelation() {
  installDispatchedRelation(
    WaveShaperNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    WaveShaperNode,
    "curve",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    WaveShaperNode,
    "oversample",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(WaveShaperNode);
}

export function installTag() {
  installDispatchedTag(WaveShaperNode);
}
