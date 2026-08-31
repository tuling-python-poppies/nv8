import * as runtime from "../webrtc-runtime.js";
import { RTCDTMFSender } from "../webrtc-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCDTMFSender);
}

export function installRelation() {
  installDispatchedRelation(
    RTCDTMFSender,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCDTMFSender,
    "ontonechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCDTMFSender,
    "canInsertDTMF",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCDTMFSender,
    "toneBuffer",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    RTCDTMFSender,
    "insertDTMF",
    1,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCDTMFSender);
}

export function installTag() {
  installDispatchedTag(RTCDTMFSender);
}
