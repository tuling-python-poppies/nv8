import * as runtime from "../longtail-events-runtime.js";
import { TextUpdateEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(TextUpdateEvent);
}

export function installRelation() {
  installDispatchedRelation(
    TextUpdateEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(TextUpdateEvent);
}

export function installTag() {
  installDispatchedTag(TextUpdateEvent);
}
