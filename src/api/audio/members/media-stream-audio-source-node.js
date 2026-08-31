import * as runtime from "../audio-runtime.js";
import { MediaStreamAudioSourceNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaStreamAudioSourceNode);
}

export function installRelation() {
  installDispatchedRelation(
    MediaStreamAudioSourceNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaStreamAudioSourceNode,
    "mediaStream",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaStreamAudioSourceNode);
}

export function installTag() {
  installDispatchedTag(MediaStreamAudioSourceNode);
}
