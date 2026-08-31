import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceEventTiming } from "../performance-longtail-runtime.js";
import { PerformanceEntry as __ExplicitParent } from "../performance-entry-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceEventTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceEventTiming,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceEventTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceEventTiming);
}
