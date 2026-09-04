import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceResourceTiming } from "../performance-longtail-runtime.js";
import { PerformanceEntry as __ExplicitParent } from "../performance-entry-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceResourceTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceResourceTiming,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "initiatorType",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "nextHopProtocol",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "deliveryType",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "workerStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "redirectStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "redirectEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "fetchStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "domainLookupStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "domainLookupEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "connectStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "connectEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "secureConnectionStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "requestStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "responseStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember14() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "responseEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember15() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "transferSize",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember16() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "encodedBodySize",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember17() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "decodedBodySize",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember18() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "serverTiming",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember19() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "responseStatus",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember20() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "finalResponseHeadersStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember21() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "firstInterimResponseStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember22() {
  installDispatchedMethod(
    PerformanceResourceTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember23() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "workerRouterEvaluationStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember24() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "workerCacheLookupStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember25() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "workerMatchedSourceType",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember26() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "workerFinalSourceType",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember27() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "renderBlockingStatus",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember28() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "contentType",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember29() {
  installDispatchedAccessor(
    PerformanceResourceTiming,
    "contentEncoding",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceResourceTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceResourceTiming);
}
