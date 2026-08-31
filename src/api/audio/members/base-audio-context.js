import * as runtime from "../audio-runtime.js";
import { BaseAudioContext } from "../audio-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BaseAudioContext);
}

export function installRelation() {
  installDispatchedRelation(
    BaseAudioContext,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BaseAudioContext,
    "destination",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BaseAudioContext,
    "sampleRate",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BaseAudioContext,
    "currentTime",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    BaseAudioContext,
    "listener",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    BaseAudioContext,
    "state",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    BaseAudioContext,
    "onstatechange",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    BaseAudioContext,
    "createAnalyser",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    BaseAudioContext,
    "createBiquadFilter",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    BaseAudioContext,
    "createBuffer",
    3,
    runtime.audioOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    BaseAudioContext,
    "createBufferSource",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    BaseAudioContext,
    "createChannelMerger",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember11() {
  installDispatchedMethod(
    BaseAudioContext,
    "createChannelSplitter",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember12() {
  installDispatchedMethod(
    BaseAudioContext,
    "createConstantSource",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember13() {
  installDispatchedMethod(
    BaseAudioContext,
    "createConvolver",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember14() {
  installDispatchedMethod(
    BaseAudioContext,
    "createDelay",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember15() {
  installDispatchedMethod(
    BaseAudioContext,
    "createDynamicsCompressor",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember16() {
  installDispatchedMethod(
    BaseAudioContext,
    "createGain",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember17() {
  installDispatchedMethod(
    BaseAudioContext,
    "createIIRFilter",
    2,
    runtime.audioOperation,
  );
}

export function installOwnedMember18() {
  installDispatchedMethod(
    BaseAudioContext,
    "createOscillator",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember19() {
  installDispatchedMethod(
    BaseAudioContext,
    "createPanner",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember20() {
  installDispatchedMethod(
    BaseAudioContext,
    "createPeriodicWave",
    2,
    runtime.audioOperation,
  );
}

export function installOwnedMember21() {
  installDispatchedMethod(
    BaseAudioContext,
    "createScriptProcessor",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember22() {
  installDispatchedMethod(
    BaseAudioContext,
    "createStereoPanner",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember23() {
  installDispatchedMethod(
    BaseAudioContext,
    "createWaveShaper",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember24() {
  installDispatchedMethod(
    BaseAudioContext,
    "decodeAudioData",
    1,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BaseAudioContext);
}

export function installOwnedMember25() {
  installDispatchedAccessor(
    BaseAudioContext,
    "audioWorklet",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installTag() {
  installDispatchedTag(BaseAudioContext);
}
