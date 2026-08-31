import * as runtime from "../audio-runtime.js";
import { ConstantSourceNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ConstantSourceNode);
}

export function installRelation() {
  installDispatchedRelation(
    ConstantSourceNode,
    "AudioScheduledSourceNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    ConstantSourceNode,
    "offset",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ConstantSourceNode);
}

export function installTag() {
  installDispatchedTag(ConstantSourceNode);
}
