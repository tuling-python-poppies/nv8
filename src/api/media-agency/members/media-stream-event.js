import * as runtime from "../media-agency-runtime.js";
import { MediaStreamEvent } from "../media-agency-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaStreamEvent);
}

export function installRelation() {
  installDispatchedRelation(
    MediaStreamEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaStreamEvent);
}

export function installTag() {
  installDispatchedTag(MediaStreamEvent);
}
