import * as runtime from "../audio-runtime.js";
import { MediaElementAudioSourceNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaElementAudioSourceNode);
}

export function installRelation() {
  installDispatchedRelation(
    MediaElementAudioSourceNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaElementAudioSourceNode,
    "mediaElement",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaElementAudioSourceNode);
}

export function installTag() {
  installDispatchedTag(MediaElementAudioSourceNode);
}
