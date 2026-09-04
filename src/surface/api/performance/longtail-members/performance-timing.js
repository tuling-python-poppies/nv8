import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceTiming } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceTiming,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceTiming,
    "navigationStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceTiming,
    "unloadEventStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PerformanceTiming,
    "unloadEventEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PerformanceTiming,
    "redirectStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PerformanceTiming,
    "redirectEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PerformanceTiming,
    "fetchStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PerformanceTiming,
    "domainLookupStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PerformanceTiming,
    "domainLookupEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PerformanceTiming,
    "connectStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    PerformanceTiming,
    "connectEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    PerformanceTiming,
    "secureConnectionStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    PerformanceTiming,
    "requestStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    PerformanceTiming,
    "responseStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    PerformanceTiming,
    "responseEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember14() {
  installDispatchedAccessor(
    PerformanceTiming,
    "domLoading",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember15() {
  installDispatchedAccessor(
    PerformanceTiming,
    "domInteractive",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember16() {
  installDispatchedAccessor(
    PerformanceTiming,
    "domContentLoadedEventStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember17() {
  installDispatchedAccessor(
    PerformanceTiming,
    "domContentLoadedEventEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember18() {
  installDispatchedAccessor(
    PerformanceTiming,
    "domComplete",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember19() {
  installDispatchedAccessor(
    PerformanceTiming,
    "loadEventStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember20() {
  installDispatchedAccessor(
    PerformanceTiming,
    "loadEventEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember21() {
  installDispatchedMethod(
    PerformanceTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceTiming);
}
