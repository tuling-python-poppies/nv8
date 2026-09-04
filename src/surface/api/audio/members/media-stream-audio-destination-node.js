import * as runtime from "../audio-runtime.js";
import { MediaStreamAudioDestinationNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaStreamAudioDestinationNode);
}

export function installRelation() {
  installDispatchedRelation(
    MediaStreamAudioDestinationNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaStreamAudioDestinationNode,
    "stream",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaStreamAudioDestinationNode);
}

export function installTag() {
  installDispatchedTag(MediaStreamAudioDestinationNode);
}
