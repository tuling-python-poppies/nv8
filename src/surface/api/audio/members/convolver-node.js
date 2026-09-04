import * as runtime from "../audio-runtime.js";
import { ConvolverNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ConvolverNode);
}

export function installRelation() {
  installDispatchedRelation(
    ConvolverNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    ConvolverNode,
    "buffer",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    ConvolverNode,
    "normalize",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ConvolverNode);
}

export function installTag() {
  installDispatchedTag(ConvolverNode);
}
