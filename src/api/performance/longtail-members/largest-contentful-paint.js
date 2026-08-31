import * as runtime from "../performance-longtail-runtime.js";
import { LargestContentfulPaint } from "../performance-longtail-runtime.js";
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
  installDispatchedGlobal(LargestContentfulPaint);
}

export function installRelation() {
  installDispatchedRelation(
    LargestContentfulPaint,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "renderTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "loadTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "size",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "id",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "url",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "element",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    LargestContentfulPaint,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "paintTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    LargestContentfulPaint,
    "presentationTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(LargestContentfulPaint);
}

export function installTag() {
  installDispatchedTag(LargestContentfulPaint);
}
