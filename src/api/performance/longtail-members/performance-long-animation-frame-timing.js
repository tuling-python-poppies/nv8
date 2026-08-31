import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceLongAnimationFrameTiming } from "../performance-longtail-runtime.js";
import { PerformanceEntry as __ExplicitParent } from "../performance-entry-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceLongAnimationFrameTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceLongAnimationFrameTiming,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceLongAnimationFrameTiming,
    "renderStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceLongAnimationFrameTiming,
    "styleAndLayoutStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PerformanceLongAnimationFrameTiming,
    "firstUIEventTimestamp",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PerformanceLongAnimationFrameTiming,
    "blockingDuration",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PerformanceLongAnimationFrameTiming,
    "scripts",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    PerformanceLongAnimationFrameTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PerformanceLongAnimationFrameTiming,
    "paintTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PerformanceLongAnimationFrameTiming,
    "presentationTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceLongAnimationFrameTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceLongAnimationFrameTiming);
}
