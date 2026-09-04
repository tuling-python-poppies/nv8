import * as runtime from "../longtail-events-runtime.js";
import { SpeechRecognitionErrorEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(SpeechRecognitionErrorEvent);
}

export function installRelation() {
  installDispatchedRelation(
    SpeechRecognitionErrorEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(SpeechRecognitionErrorEvent);
}

export function installTag() {
  installDispatchedTag(SpeechRecognitionErrorEvent);
}
