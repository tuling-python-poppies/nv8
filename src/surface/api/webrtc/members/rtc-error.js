import * as runtime from "../webrtc-runtime.js";
import { RTCError } from "../webrtc-runtime.js";
import { DOMException as __ExplicitParent } from "../../event/dom-exception-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCError);
}

export function installRelation() {
  installDispatchedRelation(
    RTCError,
    "DOMException",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCError,
    "errorDetail",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCError,
    "sdpLineNumber",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCError,
    "httpRequestStatusCode",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCError,
    "sctpCauseCode",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    RTCError,
    "receivedAlert",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    RTCError,
    "sentAlert",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCError);
}

export function installTag() {
  installDispatchedTag(RTCError);
}
