import * as runtime from "../webrtc-runtime.js";
import { RTCStatsReport } from "../webrtc-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIterator,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RTCStatsReport);
}

export function installRelation() {
  installDispatchedRelation(
    RTCStatsReport,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    RTCStatsReport,
    "size",
    runtime.webrtcProperty,
    runtime.setWebrtcProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    RTCStatsReport,
    "entries",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    RTCStatsReport,
    "forEach",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    RTCStatsReport,
    "get",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    RTCStatsReport,
    "has",
    1,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    RTCStatsReport,
    "keys",
    0,
    runtime.webrtcOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    RTCStatsReport,
    "values",
    0,
    runtime.webrtcOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RTCStatsReport);
}

export function installTag() {
  installDispatchedTag(RTCStatsReport);
}

export function installIterator() {
  installDispatchedIterator(
    RTCStatsReport,
    "entries",
    runtime.webrtcIterator,
  );
}
