import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceElementTiming } from "../performance-longtail-runtime.js";
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
  installDispatchedGlobal(PerformanceElementTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceElementTiming,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "renderTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "loadTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "intersectionRect",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "identifier",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "naturalWidth",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "naturalHeight",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "id",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "element",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "url",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    PerformanceElementTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "paintTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    PerformanceElementTiming,
    "presentationTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceElementTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceElementTiming);
}
