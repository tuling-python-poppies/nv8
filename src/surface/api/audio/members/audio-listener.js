import * as runtime from "../audio-runtime.js";
import { AudioListener } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioListener);
}

export function installRelation() {
  installDispatchedRelation(
    AudioListener,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioListener,
    "positionX",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioListener,
    "positionY",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioListener,
    "positionZ",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    AudioListener,
    "forwardX",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    AudioListener,
    "forwardY",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    AudioListener,
    "forwardZ",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    AudioListener,
    "upX",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    AudioListener,
    "upY",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    AudioListener,
    "upZ",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    AudioListener,
    "setOrientation",
    6,
    runtime.audioOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    AudioListener,
    "setPosition",
    3,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioListener);
}

export function installTag() {
  installDispatchedTag(AudioListener);
}
