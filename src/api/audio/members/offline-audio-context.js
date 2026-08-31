import * as runtime from "../audio-runtime.js";
import { OfflineAudioContext } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(OfflineAudioContext);
}

export function installRelation() {
  installDispatchedRelation(
    OfflineAudioContext,
    "BaseAudioContext",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    OfflineAudioContext,
    "oncomplete",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    OfflineAudioContext,
    "length",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    OfflineAudioContext,
    "resume",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    OfflineAudioContext,
    "startRendering",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    OfflineAudioContext,
    "suspend",
    1,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(OfflineAudioContext);
}

export function installTag() {
  installDispatchedTag(OfflineAudioContext);
}
