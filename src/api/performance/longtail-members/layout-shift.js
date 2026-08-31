import * as runtime from "../performance-longtail-runtime.js";
import { LayoutShift } from "../performance-longtail-runtime.js";
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
  installDispatchedGlobal(LayoutShift);
}

export function installRelation() {
  installDispatchedRelation(
    LayoutShift,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    LayoutShift,
    "value",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    LayoutShift,
    "hadRecentInput",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    LayoutShift,
    "lastInputTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    LayoutShift,
    "sources",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    LayoutShift,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(LayoutShift);
}

export function installTag() {
  installDispatchedTag(LayoutShift);
}
