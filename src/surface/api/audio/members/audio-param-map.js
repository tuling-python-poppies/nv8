import * as runtime from "../audio-runtime.js";
import { AudioParamMap } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIteratorAlias,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioParamMap);
}

export function installRelation() {
  installDispatchedRelation(
    AudioParamMap,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    AudioParamMap,
    "size",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    AudioParamMap,
    "entries",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    AudioParamMap,
    "forEach",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    AudioParamMap,
    "get",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    AudioParamMap,
    "has",
    1,
    runtime.audioOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    AudioParamMap,
    "keys",
    0,
    runtime.audioOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    AudioParamMap,
    "values",
    0,
    runtime.audioOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioParamMap);
}

export function installTag() {
  installDispatchedTag(AudioParamMap);
}

export function installIterator() {
  installDispatchedIteratorAlias(
    AudioParamMap,
    "entries",
  );
}
