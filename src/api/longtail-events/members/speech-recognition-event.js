import * as runtime from "../longtail-events-runtime.js";
import { SpeechRecognitionEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(SpeechRecognitionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    SpeechRecognitionEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(SpeechRecognitionEvent);
}

export function installTag() {
  installDispatchedTag(SpeechRecognitionEvent);
}
