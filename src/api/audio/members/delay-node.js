import * as runtime from "../audio-runtime.js";
import { DelayNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DelayNode);
}

export function installRelation() {
  installDispatchedRelation(
    DelayNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    DelayNode,
    "delayTime",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DelayNode);
}

export function installTag() {
  installDispatchedTag(DelayNode);
}
