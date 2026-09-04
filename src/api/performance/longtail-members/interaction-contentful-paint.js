import * as runtime from "../performance-longtail-runtime.js";
import { InteractionContentfulPaint } from "../performance-longtail-runtime.js";
import { PerformanceEntry as __ExplicitParent } from "../performance-entry-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

// Edge 151 新增的性能条目类型。`browserMajorVersion >= 151` 门控，见
// `install-performance-longtail.js`。
//
// 成员的安装顺序就是真实 Edge 的原型枚举顺序，实测自 Edge 152：
//   largestContentfulPaint, interactionId, toJSON, constructor,
//   paintTime, presentationTime
//
// 注意 `constructor` 夹在中间——`paintTime` / `presentationTime` 在 Chromium 里
// 是后置注册的（`LargestContentfulPaint` / `PerformancePaintTiming` 同样如此）。
// 按「先装完所有成员再装 backlink」的惯例写会把 constructor 排到末尾，那是可
// 检测偏差。接线顺序在 `install-performance-longtail.js` 里。

export function installGlobal() {
  installDispatchedGlobal(InteractionContentfulPaint);
}

export function installRelation() {
  installDispatchedRelation(
    InteractionContentfulPaint,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    InteractionContentfulPaint,
    "largestContentfulPaint",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    InteractionContentfulPaint,
    "interactionId",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    InteractionContentfulPaint,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    InteractionContentfulPaint,
    "paintTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    InteractionContentfulPaint,
    "presentationTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(InteractionContentfulPaint);
}

export function installTag() {
  installDispatchedTag(InteractionContentfulPaint);
}
