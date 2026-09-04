import * as runtime from "../audio-runtime.js";
import { ScriptProcessorNode } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ScriptProcessorNode);
}

export function installRelation() {
  installDispatchedRelation(
    ScriptProcessorNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    ScriptProcessorNode,
    "onaudioprocess",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    ScriptProcessorNode,
    "bufferSize",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ScriptProcessorNode);
}

export function installTag() {
  installDispatchedTag(ScriptProcessorNode);
}
