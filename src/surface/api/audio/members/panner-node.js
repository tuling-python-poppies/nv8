import * as runtime from "../audio-runtime.js";
import { PannerNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PannerNode);
}

export function installRelation() {
  installDispatchedRelation(
    PannerNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PannerNode,
    "panningModel",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PannerNode,
    "positionX",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PannerNode,
    "positionY",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PannerNode,
    "positionZ",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PannerNode,
    "orientationX",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PannerNode,
    "orientationY",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PannerNode,
    "orientationZ",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PannerNode,
    "distanceModel",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PannerNode,
    "refDistance",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    PannerNode,
    "maxDistance",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    PannerNode,
    "rolloffFactor",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    PannerNode,
    "coneInnerAngle",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    PannerNode,
    "coneOuterAngle",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    PannerNode,
    "coneOuterGain",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember14() {
  installDispatchedMethod(
    PannerNode,
    "setOrientation",
    3,
    runtime.audioOperation,
  );
}

export function installOwnedMember15() {
  installDispatchedMethod(
    PannerNode,
    "setPosition",
    3,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PannerNode);
}

export function installTag() {
  installDispatchedTag(PannerNode);
}
