import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceObserverEntryList } from "../performance-longtail-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceObserverEntryList);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceObserverEntryList,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    PerformanceObserverEntryList,
    "getEntries",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    PerformanceObserverEntryList,
    "getEntriesByName",
    1,
    runtime.performanceLongtailOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    PerformanceObserverEntryList,
    "getEntriesByType",
    1,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceObserverEntryList);
}

export function installTag() {
  installDispatchedTag(PerformanceObserverEntryList);
}
