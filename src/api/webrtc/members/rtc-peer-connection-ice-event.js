import * as runtime from "../webrtc-runtime.js";
import { RTCPeerConnectionIceEvent } from "../webrtc-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCPeerConnectionIceEvent);
}

export function installRelation() {
  installDispatchedRelation(
    RTCPeerConnectionIceEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCPeerConnectionIceEvent);
}

export function installTag() {
  installDispatchedTag(RTCPeerConnectionIceEvent);
}
