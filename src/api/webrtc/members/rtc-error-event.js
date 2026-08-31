import * as runtime from "../webrtc-runtime.js";
import { RTCErrorEvent } from "../webrtc-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCErrorEvent);
}

export function installRelation() {
  installDispatchedRelation(
    RTCErrorEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCErrorEvent);
}

export function installTag() {
  installDispatchedTag(RTCErrorEvent);
}
