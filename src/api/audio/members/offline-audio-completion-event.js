import * as runtime from "../audio-runtime.js";
import { OfflineAudioCompletionEvent } from "../audio-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(OfflineAudioCompletionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    OfflineAudioCompletionEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(OfflineAudioCompletionEvent);
}

export function installTag() {
  installDispatchedTag(OfflineAudioCompletionEvent);
}
