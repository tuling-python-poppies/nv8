import * as runtime from "../media-agency-runtime.js";
import { MediaEncryptedEvent } from "../media-agency-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaEncryptedEvent);
}

export function installRelation() {
  installDispatchedRelation(
    MediaEncryptedEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaEncryptedEvent);
}

export function installTag() {
  installDispatchedTag(MediaEncryptedEvent);
}
