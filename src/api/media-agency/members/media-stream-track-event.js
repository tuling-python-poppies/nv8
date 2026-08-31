import * as runtime from "../media-agency-runtime.js";
import { MediaStreamTrackEvent } from "../media-agency-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaStreamTrackEvent);
}

export function installRelation() {
  installDispatchedRelation(
    MediaStreamTrackEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaStreamTrackEvent);
}

export function installTag() {
  installDispatchedTag(MediaStreamTrackEvent);
}
