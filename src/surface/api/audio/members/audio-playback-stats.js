import * as runtime from "../audio-runtime.js";
import { AudioPlaybackStats } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioPlaybackStats);
}

export function installRelation() {
  installDispatchedRelation(
    AudioPlaybackStats,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioPlaybackStats,
    "underrunDuration",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    AudioPlaybackStats,
    "underrunEvents",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    AudioPlaybackStats,
    "totalDuration",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    AudioPlaybackStats,
    "averageLatency",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    AudioPlaybackStats,
    "minimumLatency",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    AudioPlaybackStats,
    "maximumLatency",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AudioPlaybackStats,
    "resetLatency",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    AudioPlaybackStats,
    "toJSON",
    0,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioPlaybackStats);
}

export function installTag() {
  installDispatchedTag(AudioPlaybackStats);
}
