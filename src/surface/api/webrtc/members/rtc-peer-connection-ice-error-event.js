import * as runtime from "../webrtc-runtime.js";
import { RTCPeerConnectionIceErrorEvent } from "../webrtc-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCPeerConnectionIceErrorEvent);
}

export function installRelation() {
  installDispatchedRelation(
    RTCPeerConnectionIceErrorEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCPeerConnectionIceErrorEvent);
}

export function installTag() {
  installDispatchedTag(RTCPeerConnectionIceErrorEvent);
}
