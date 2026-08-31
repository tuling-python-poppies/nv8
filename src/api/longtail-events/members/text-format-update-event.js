import * as runtime from "../longtail-events-runtime.js";
import { TextFormatUpdateEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(TextFormatUpdateEvent);
}

export function installRelation() {
  installDispatchedRelation(
    TextFormatUpdateEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(TextFormatUpdateEvent);
}

export function installTag() {
  installDispatchedTag(TextFormatUpdateEvent);
}
