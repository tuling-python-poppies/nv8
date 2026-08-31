import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceObserver } from "../performance-longtail-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceObserver);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceObserver,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    PerformanceObserver,
    "disconnect",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    PerformanceObserver,
    "observe",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    PerformanceObserver,
    "takeRecords",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceObserver);
}

export function installTag() {
  installDispatchedTag(PerformanceObserver);
}
