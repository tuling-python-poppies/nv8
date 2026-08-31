import * as runtime from "../audio-runtime.js";
import { AudioDestinationNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioDestinationNode);
}

export function installRelation() {
  installDispatchedRelation(
    AudioDestinationNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioDestinationNode,
    "maxChannelCount",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioDestinationNode);
}

export function installTag() {
  installDispatchedTag(AudioDestinationNode);
}
