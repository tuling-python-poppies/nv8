import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceLongTaskTiming } from "../performance-longtail-runtime.js";
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
  installDispatchedGlobal(PerformanceLongTaskTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceLongTaskTiming,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceLongTaskTiming,
    "attribution",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    PerformanceLongTaskTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceLongTaskTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceLongTaskTiming);
}
