import * as runtime from "../webrtc-runtime.js";
import { RTCDataChannelEvent } from "../webrtc-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCDataChannelEvent);
}

export function installRelation() {
  installDispatchedRelation(
    RTCDataChannelEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCDataChannelEvent);
}

export function installTag() {
  installDispatchedTag(RTCDataChannelEvent);
}
