import * as runtime from "../performance-longtail-runtime.js";
import { PerformancePaintTiming } from "../performance-longtail-runtime.js";
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
  installDispatchedGlobal(PerformancePaintTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformancePaintTiming,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformancePaintTiming,
    "paintTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformancePaintTiming,
    "presentationTime",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    PerformancePaintTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformancePaintTiming);
}

export function installTag() {
  installDispatchedTag(PerformancePaintTiming);
}
