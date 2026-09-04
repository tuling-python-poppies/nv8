import * as runtime from "../webrtc-runtime.js";
import { RTCSctpTransport } from "../webrtc-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCSctpTransport);
}

export function installRelation() {
  installDispatchedRelation(
    RTCSctpTransport,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCSctpTransport,
    "transport",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCSctpTransport,
    "state",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCSctpTransport,
    "maxMessageSize",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCSctpTransport,
    "maxChannels",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    RTCSctpTransport,
    "onstatechange",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCSctpTransport);
}

export function installTag() {
  installDispatchedTag(RTCSctpTransport);
}
