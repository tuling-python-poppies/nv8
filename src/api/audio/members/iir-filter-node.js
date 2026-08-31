import * as runtime from "../audio-runtime.js";
import { IIRFilterNode } from "../audio-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(IIRFilterNode);
}

export function installRelation() {
  installDispatchedRelation(
    IIRFilterNode,
    "AudioNode",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    IIRFilterNode,
    "getFrequencyResponse",
    3,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(IIRFilterNode);
}

export function installTag() {
  installDispatchedTag(IIRFilterNode);
}
