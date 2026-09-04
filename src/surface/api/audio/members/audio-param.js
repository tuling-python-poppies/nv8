import * as runtime from "../audio-runtime.js";
import { AudioParam } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioParam);
}

export function installRelation() {
  installDispatchedRelation(
    AudioParam,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioParam,
    "value",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioParam,
    "automationRate",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioParam,
    "defaultValue",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    AudioParam,
    "minValue",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    AudioParam,
    "maxValue",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    AudioParam,
    "cancelAndHoldAtTime",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AudioParam,
    "cancelScheduledValues",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    AudioParam,
    "exponentialRampToValueAtTime",
    2,
    runtime.audioOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    AudioParam,
    "linearRampToValueAtTime",
    2,
    runtime.audioOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    AudioParam,
    "setTargetAtTime",
    3,
    runtime.audioOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    AudioParam,
    "setValueAtTime",
    2,
    runtime.audioOperation,
  );
}

export function installOwnedMember11() {
  installDispatchedMethod(
    AudioParam,
    "setValueCurveAtTime",
    3,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioParam);
}

export function installTag() {
  installDispatchedTag(AudioParam);
}
