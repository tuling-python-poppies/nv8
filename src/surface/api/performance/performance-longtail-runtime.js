import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializePerformanceEntry } from "./performance-entry-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const longtailSlot = createRealmSlot(() => ({
  observers: new Set(),
}), "longtail");

function longtailState() {
  return longtailSlot.get(globalThis);
}

const state = new WeakMap();

export function VisibilityStateEntry() { illegalConstructor("VisibilityStateEntry", new.target); }
export function TaskAttributionTiming() { illegalConstructor("TaskAttributionTiming", new.target); }
export function PerformanceScriptTiming() { illegalConstructor("PerformanceScriptTiming", new.target); }
export function PerformanceResourceTiming() { illegalConstructor("PerformanceResourceTiming", new.target); }
export function PerformancePaintTiming() { illegalConstructor("PerformancePaintTiming", new.target); }
export function PerformanceObserverEntryList() { illegalConstructor("PerformanceObserverEntryList", new.target); }
export function PerformanceObserver(callback) {
  requireNew(new.target, "PerformanceObserver");
  if (typeof callback !== "function") {
    throw new TypeError("PerformanceObserver callback must be callable");
  }
  state.set(this, {
    kind: "observer",
    object: this,
    callback,
    entryTypes: new Set(),
    records: [],
    scheduled: false,
    active: true,
  });
}
export function PerformanceNavigationTiming() { illegalConstructor("PerformanceNavigationTiming", new.target); }
export function PerformanceNavigation() { illegalConstructor("PerformanceNavigation", new.target); }
export function PerformanceLongTaskTiming() { illegalConstructor("PerformanceLongTaskTiming", new.target); }
export function PerformanceLongAnimationFrameTiming() { illegalConstructor("PerformanceLongAnimationFrameTiming", new.target); }
export function PerformanceEventTiming() { illegalConstructor("PerformanceEventTiming", new.target); }
export function PerformanceElementTiming() { illegalConstructor("PerformanceElementTiming", new.target); }
export function LayoutShiftAttribution() { illegalConstructor("LayoutShiftAttribution", new.target); }
export function LayoutShift() { illegalConstructor("LayoutShift", new.target); }
export function LargestContentfulPaint() { illegalConstructor("LargestContentfulPaint", new.target); }
export function PerformanceServerTiming() { illegalConstructor("PerformanceServerTiming", new.target); }
export function PerformanceTiming() { illegalConstructor("PerformanceTiming", new.target); }
export function PerformanceTimingConfidence() { illegalConstructor("PerformanceTimingConfidence", new.target); }
export function EventCounts() { illegalConstructor("EventCounts", new.target); }
// Edge 151 新增的两个性能条目类型。它们的成员安装顺序由各自的
// `longtail-members/*` 模块提供；Edge 152 profile 的最终原型顺序由
// `prototype-surface-order.js` 做数据驱动校正。Edge 150 不暴露这两个接口。
export function InteractionContentfulPaint() { illegalConstructor("InteractionContentfulPaint", new.target); }
export function PerformanceSoftNavigation() { illegalConstructor("PerformanceSoftNavigation", new.target); }

const performanceLongtailConstructors = Object.freeze([
  InteractionContentfulPaint,
  PerformanceSoftNavigation,
  VisibilityStateEntry,
  TaskAttributionTiming,
  PerformanceScriptTiming,
  PerformanceResourceTiming,
  PerformancePaintTiming,
  PerformanceObserverEntryList,
  PerformanceObserver,
  PerformanceNavigationTiming,
  PerformanceNavigation,
  PerformanceLongTaskTiming,
  PerformanceLongAnimationFrameTiming,
  PerformanceEventTiming,
  PerformanceElementTiming,
  LayoutShiftAttribution,
  LayoutShift,
  LargestContentfulPaint,
  PerformanceServerTiming,
  PerformanceTiming,
  PerformanceTimingConfidence,
  EventCounts,
]);
for (const Constructor of performanceLongtailConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export const supportedEntryTypes = Object.freeze([
  "element",
  "event",
  "first-input",
  "largest-contentful-paint",
  "layout-shift",
  "long-animation-frame",
  "longtask",
  "mark",
  "measure",
  "navigation",
  "paint",
  "resource",
  "visibility-state",
]);

export function createPerformanceTiming(origin) {
  return createRecord(PerformanceTiming, "timing", {
    navigationStart: origin,
    unloadEventStart: 0,
    unloadEventEnd: 0,
    redirectStart: 0,
    redirectEnd: 0,
    fetchStart: origin,
    domainLookupStart: origin,
    domainLookupEnd: origin,
    connectStart: origin,
    connectEnd: origin,
    secureConnectionStart: 0,
    requestStart: origin,
    responseStart: origin,
    responseEnd: origin,
    domLoading: origin,
    domInteractive: origin,
    domContentLoadedEventStart: origin,
    domContentLoadedEventEnd: origin,
    domComplete: origin,
    loadEventStart: origin,
    loadEventEnd: origin,
  });
}

export function createPerformanceNavigation() {
  return createRecord(PerformanceNavigation, "navigation", {
    type: 0,
    redirectCount: 0,
  });
}

export function createPerformanceNavigationTiming(origin, navigationId) {
  const value = createRecord(PerformanceNavigationTiming, "navigationTiming", {
    type: "navigate",
    redirectCount: 0,
    navigationId,
  });
  initializePerformanceEntry(value, "", "navigation", 0, 0, { navigationId });
  return value;
}

export function createEventCounts() {
  return createRecord(EventCounts, "eventCounts", {
    values: new Map(),
  });
}

export function performanceLongtailProperty(value, name) {
  const record = requireRecord(value);
  if (record.kind === "eventCounts" && name === "size") {
    return record.values.size;
  }
  return record[name];
}

export function performanceLongtailOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "observer") {
    return observerOperation(record, name, args);
  }
  if (record.kind === "entryList") {
    if (name === "getEntries") return [...record.entries];
    if (name === "getEntriesByType") {
      return record.entries.filter(entry => entry.entryType === `${args[0]}`);
    }
    if (name === "getEntriesByName") {
      const expectedName = `${args[0]}`;
      const type = args[1] === undefined ? null : `${args[1]}`;
      return record.entries.filter(entry => {
        return entry.name === expectedName
          && (type === null || entry.entryType === type);
      });
    }
  }
  if (record.kind === "eventCounts") {
    return mapOperation(record, value, name, args);
  }
  if (name === "toJSON") return recordJSON(record);
  throw new TypeError(`Unsupported performance operation: ${name}`);
}

export function performanceLongtailIterator(value) {
  const record = requireRecord(value);
  if (record.kind !== "eventCounts") throw new TypeError("Illegal invocation");
  return record.values.entries();
}

export function notifyPerformanceObservers(entry) {
  for (const observer of longtailState().observers) {
    const record = state.get(observer);
    if (!record?.active || !record.entryTypes.has(entry.entryType)) continue;
    record.records.push(entry);
    scheduleObserver(record);
  }
}

function observerOperation(record, name, args) {
  if (name === "disconnect") {
    record.active = false;
    record.entryTypes.clear();
    record.records.length = 0;
    longtailState().observers.delete(record.object);
    return;
  }
  if (name === "takeRecords") return record.records.splice(0);
  if (name === "observe") {
    const options = args[0] ?? {};
    const types = options.entryTypes !== undefined
      ? [...options.entryTypes].map(String)
      : options.type !== undefined
        ? [`${options.type}`]
        : [];
    if (types.length === 0) {
      throw new TypeError("A performance entry type is required");
    }
    record.entryTypes = new Set(types);
    record.active = true;
    longtailState().observers.add(record.object);
    if (options.buffered) {
      const buffered = globalThis.performance?.getEntries?.() ?? [];
      record.records.push(...buffered.filter(entry => {
        return record.entryTypes.has(entry.entryType);
      }));
      if (record.records.length > 0) scheduleObserver(record);
    }
  }
}

function scheduleObserver(record) {
  if (record.scheduled) return;
  record.scheduled = true;
  Promise.resolve().then(() => {
    record.scheduled = false;
    if (!record.active || record.records.length === 0) return;
    const list = createRecord(PerformanceObserverEntryList, "entryList", {
      entries: Object.freeze(record.records.splice(0)),
    });
    Reflect.apply(record.callback, undefined, [list, record.object, {}]);
  });
}

function mapOperation(record, object, name, args) {
  if (name === "entries") return record.values.entries();
  if (name === "keys") return record.values.keys();
  if (name === "values") return record.values.values();
  if (name === "get") return record.values.get(`${args[0]}`);
  if (name === "has") return record.values.has(`${args[0]}`);
  if (name === "forEach") {
    record.values.forEach((count, eventName) => {
      Reflect.apply(args[0], args[1], [count, eventName, object]);
    });
  }
}

function recordJSON(record) {
  const output = {};
  for (const [name, value] of Object.entries(record)) {
    if (name === "kind" || name === "values") continue;
    output[name] = value;
  }
  return output;
}

function createRecord(Constructor, kind, fields) {
  const value = Object.create(Constructor.prototype);
  state.set(value, { kind, ...fields });
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use new`);
  }
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
