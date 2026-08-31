import * as runtime from "../longtail-events-runtime.js";
import { CharacterBoundsUpdateEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(CharacterBoundsUpdateEvent);
}

export function installRelation() {
  installDispatchedRelation(
    CharacterBoundsUpdateEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(CharacterBoundsUpdateEvent);
}

export function installTag() {
  installDispatchedTag(CharacterBoundsUpdateEvent);
}
