import * as runtime from "../audio-runtime.js";
import { AnalyserNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AnalyserNode);
}

export function installRelation() {
  installDispatchedRelation(
    AnalyserNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AnalyserNode,
    "fftSize",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AnalyserNode,
    "frequencyBinCount",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AnalyserNode,
    "minDecibels",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    AnalyserNode,
    "maxDecibels",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    AnalyserNode,
    "smoothingTimeConstant",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    AnalyserNode,
    "getByteFrequencyData",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AnalyserNode,
    "getByteTimeDomainData",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    AnalyserNode,
    "getFloatFrequencyData",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    AnalyserNode,
    "getFloatTimeDomainData",
    1,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AnalyserNode);
}

export function installTag() {
  installDispatchedTag(AnalyserNode);
}
