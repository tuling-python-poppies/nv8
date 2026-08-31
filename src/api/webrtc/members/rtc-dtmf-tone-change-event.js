import * as runtime from "../webrtc-runtime.js";
import { RTCDTMFToneChangeEvent } from "../webrtc-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCDTMFToneChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    RTCDTMFToneChangeEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCDTMFToneChangeEvent);
}

export function installTag() {
  installDispatchedTag(RTCDTMFToneChangeEvent);
}
