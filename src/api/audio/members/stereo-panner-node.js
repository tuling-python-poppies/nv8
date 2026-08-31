import * as runtime from "../audio-runtime.js";
import { StereoPannerNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(StereoPannerNode);
}

export function installRelation() {
  installDispatchedRelation(
    StereoPannerNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    StereoPannerNode,
    "pan",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(StereoPannerNode);
}

export function installTag() {
  installDispatchedTag(StereoPannerNode);
}
