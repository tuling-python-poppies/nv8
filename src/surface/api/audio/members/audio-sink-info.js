import * as runtime from "../audio-runtime.js";
import { AudioSinkInfo } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioSinkInfo);
}

export function installRelation() {
  installDispatchedRelation(
    AudioSinkInfo,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioSinkInfo,
    "type",
    runtime.audioProperty,
    runtime.setAudioProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioSinkInfo);
}

export function installTag() {
  installDispatchedTag(AudioSinkInfo);
}
