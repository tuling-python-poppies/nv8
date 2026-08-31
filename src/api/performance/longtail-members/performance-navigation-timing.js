import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceNavigationTiming } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceNavigationTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceNavigationTiming,
    "PerformanceResourceTiming",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "unloadEventStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "unloadEventEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "domInteractive",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "domContentLoadedEventStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "domContentLoadedEventEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "domComplete",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "loadEventStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "loadEventEnd",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "type",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "redirectCount",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "criticalCHRestart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "activationStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember12() {
  installDispatchedMethod(
    PerformanceNavigationTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "confidence",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceNavigationTiming);
}

export function installOwnedMember14() {
  installDispatchedAccessor(
    PerformanceNavigationTiming,
    "notRestoredReasons",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installTag() {
  installDispatchedTag(PerformanceNavigationTiming);
}
