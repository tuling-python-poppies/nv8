import * as runtime from "../longtail-events-runtime.js";
import { AudioProcessingEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AudioProcessingEvent);
}

export function installRelation() {
  installDispatchedRelation(
    AudioProcessingEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AudioProcessingEvent);
}

export function installTag() {
  installDispatchedTag(AudioProcessingEvent);
}
