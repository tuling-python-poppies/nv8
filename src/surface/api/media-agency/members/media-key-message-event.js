import * as runtime from "../media-agency-runtime.js";
import { MediaKeyMessageEvent } from "../media-agency-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaKeyMessageEvent);
}

export function installRelation() {
  installDispatchedRelation(
    MediaKeyMessageEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaKeyMessageEvent);
}

export function installTag() {
  installDispatchedTag(MediaKeyMessageEvent);
}
