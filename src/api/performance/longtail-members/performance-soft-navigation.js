import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceSoftNavigation } from "../performance-longtail-runtime.js";
import { PerformanceEntry as __ExplicitParent } from "../performance-entry-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

// Edge 151 新增的性能条目类型。`browserMajorVersion >= 151` 门控。
//
// 成员安装顺序 = 真实 Edge 152 实测的原型枚举顺序：
//   navigationType, interactionId, getLargestInteractionContentfulPaint,
//   constructor, paintTime, presentationTime

export function installGlobal() {
  installDispatchedGlobal(PerformanceSoftNavigation);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceSoftNavigation,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceSoftNavigation,
    "navigationType",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceSoftNavigation,
    "interactionId",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    PerformanceSoftNavigation,
    "getLargestInteractionContentfulPaint",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PerformanceSoftNavigation,
    "paintTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PerformanceSoftNavigation,
    "presentationTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceSoftNavigation);
}

export function installTag() {
  installDispatchedTag(PerformanceSoftNavigation);
}
