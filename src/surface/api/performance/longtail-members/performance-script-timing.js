import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceScriptTiming } from "../performance-longtail-runtime.js";
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
  installDispatchedGlobal(PerformanceScriptTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceScriptTiming,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "invokerType",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "invoker",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "windowAttribution",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "executionStart",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "forcedStyleAndLayoutDuration",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "pauseDuration",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "window",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "sourceURL",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "sourceFunctionName",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    PerformanceScriptTiming,
    "sourceCharPosition",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    PerformanceScriptTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceScriptTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceScriptTiming);
}
