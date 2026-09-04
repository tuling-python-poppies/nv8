import * as runtime from "../webrtc-runtime.js";
import { RTCTrackEvent } from "../webrtc-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCTrackEvent);
}

export function installRelation() {
  installDispatchedRelation(
    RTCTrackEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCTrackEvent);
}

export function installTag() {
  installDispatchedTag(RTCTrackEvent);
}
