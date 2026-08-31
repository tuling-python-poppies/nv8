import * as runtime from "../audio-runtime.js";
import { AudioNode } from "../audio-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioNode);
}

export function installRelation() {
  installDispatchedRelation(
    AudioNode,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioNode,
    "context",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioNode,
    "numberOfInputs",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioNode,
    "numberOfOutputs",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    AudioNode,
    "channelCount",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    AudioNode,
    "channelCountMode",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    AudioNode,
    "channelInterpretation",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AudioNode,
    "connect",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    AudioNode,
    "disconnect",
    0,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioNode);
}

export function installTag() {
  installDispatchedTag(AudioNode);
}
