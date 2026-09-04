import * as runtime from "../webrtc-runtime.js";
import { RTCDataChannel } from "../webrtc-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCDataChannel);
}

export function installRelation() {
  installDispatchedRelation(
    RTCDataChannel,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCDataChannel,
    "label",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    RTCDataChannel,
    "ordered",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    RTCDataChannel,
    "maxPacketLifeTime",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    RTCDataChannel,
    "maxRetransmits",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    RTCDataChannel,
    "protocol",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    RTCDataChannel,
    "negotiated",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    RTCDataChannel,
    "id",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    RTCDataChannel,
    "readyState",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    RTCDataChannel,
    "bufferedAmount",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    RTCDataChannel,
    "bufferedAmountLowThreshold",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    RTCDataChannel,
    "onopen",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    RTCDataChannel,
    "onbufferedamountlow",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    RTCDataChannel,
    "onerror",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    RTCDataChannel,
    "onclosing",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember14() {
  installDispatchedAccessor(
    RTCDataChannel,
    "onclose",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember15() {
  installDispatchedAccessor(
    RTCDataChannel,
    "onmessage",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember16() {
  installDispatchedAccessor(
    RTCDataChannel,
    "binaryType",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    true,
  );
}

export function installOwnedMember17() {
  installDispatchedAccessor(
    RTCDataChannel,
    "reliable",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember18() {
  installDispatchedMethod(
    RTCDataChannel,
    "close",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember19() {
  installDispatchedMethod(
    RTCDataChannel,
    "send",
    1,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCDataChannel);
}

export function installTag() {
  installDispatchedTag(RTCDataChannel);
}
