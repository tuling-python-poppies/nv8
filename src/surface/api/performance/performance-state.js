import { timeOrigin, timingProfile } from "../../../infra/scheduler/monotonic-clock.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { Performance } from "./performance-constructor.js";
import {
  createEventCounts,
  createPerformanceNavigation,
  createPerformanceNavigationTiming,
  createPerformanceTiming,
  notifyPerformanceObservers,
} from "./performance-longtail-runtime.js";
import { currentNavigationSequence } from "../../../infra/navigation/navigation-state.js";

const performanceState = new WeakMap();
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const performanceSlot = createRealmSlot(() => ({
  singleton: null,
  navigationEntryEnabled: false,
}), "performance");

function performanceRealmState() {
  return performanceSlot.get(globalThis);
}

export function configurePerformanceSurface({
  edge151Surface = false,
  includeNavigationEntry = true,
} = {}) {
  performanceRealmState().navigationEntryEnabled = Boolean(edge151Surface && includeNavigationEntry);
}

function createPerformance() {
  if (performanceRealmState().singleton !== null) {
    return performanceRealmState().singleton;
  }
  const value = Object.create(Performance.prototype);
  initializeEventTarget(value);
  const origin = timeOrigin();
  const entries = performanceRealmState().navigationEntryEnabled
    ? [createPerformanceNavigationTiming(origin, currentNavigationSequence())]
    : [];
  performanceState.set(value, {
    timeOrigin: origin,
    onresourcetimingbufferfull: null,
    entries,
    resourceTimingBufferSize: 250,
    timing: createPerformanceTiming(origin),
    navigation: createPerformanceNavigation(),
    memory: createMemory(),
    eventCounts: createEventCounts(),
    interactionCount: 0,
  });
  performanceRealmState().singleton = value;
  return value;
}

export function requirePerformance(value) {
  const state = performanceState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function appendPerformanceEntry(performance, entry) {
  requirePerformance(performance).entries.push(entry);
  notifyPerformanceObservers(entry);
}

export function currentPerformance() {
  return createPerformance();
}

function createMemory() {
  // Apply ±8% jitter so every sandbox session has slightly different memory values.
  // Uses a deterministic XORSHIFT-32 based on jitterSeed so values are reproducible
  // per fingerprint but differ across distinct fingerprint configs.
  const jitter = (base, seed, amp) => {
    let s = (seed ^ (base & 0xffffffff)) >>> 0;
    s = Math.imul(s ^ (s >>> 15), 1 | s) >>> 0;
    s ^= s + Math.imul(s ^ (s >>> 7), 61 | s);
    const n = ((s ^ (s >>> 14)) >>> 0) / 0xffffffff; // [0,1)
    return Math.round(base * (1 + (n * 2 - 1) * amp / 100));
  };
  const seed = timingProfile().jitterSeed ?? 0x4e5638;
  const total = jitter(22_800_000, seed, 8);
  const used  = jitter(18_400_000, seed ^ 0xdeadbeef, 8);
  const value = Object.create(null);
  Object.defineProperties(value, {
    jsHeapSizeLimit: data(4_294_705_152),
    totalJSHeapSize: data(total),
    usedJSHeapSize:  data(Math.min(used, total)),
  });
  return value;
}

function data(value) {
  return {
    value,
    writable: false,
    enumerable: true,
    configurable: true,
  };
}
