import { initializeEventTarget } from "../event/event-target-state.js";
import { createDOMPoint } from "../geometry/dom-point-constructor.js";
import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();
let visualViewportSingleton = null;

export function DOMQuad() {
  requireNew(new.target, "DOMQuad");
  state.set(this, {
    kind: "quad",
    p1: point(arguments[0]),
    p2: point(arguments[1]),
    p3: point(arguments[2]),
    p4: point(arguments[3]),
  });
}
export function ResizeObserverSize() { illegalConstructor("ResizeObserverSize"); }
export function ResizeObserverEntry() { illegalConstructor("ResizeObserverEntry"); }
export function ResizeObserver(callback) {
  requireNew(new.target, "ResizeObserver");
  if (typeof callback !== "function") {
    throw new TypeError("ResizeObserver callback must be callable");
  }
  state.set(this, {
    kind: "resizeObserver",
    object: this,
    callback,
    observed: new Map(),
    scheduled: false,
    active: true,
  });
}
export function IntersectionObserverEntry() {
  requireNew(new.target, "IntersectionObserverEntry");
  const init = arguments[0] ?? {};
  initializeIntersectionEntry(this, init);
}
export function IntersectionObserver(callback) {
  requireNew(new.target, "IntersectionObserver");
  if (typeof callback !== "function") {
    throw new TypeError("IntersectionObserver callback must be callable");
  }
  const init = arguments[1] ?? {};
  state.set(this, {
    kind: "intersectionObserver",
    object: this,
    callback,
    root: init.root ?? null,
    rootMargin: normalizeMargin(init.rootMargin),
    scrollMargin: normalizeMargin(init.scrollMargin),
    thresholds: normalizeThresholds(init.threshold),
    delay: Math.max(0, Number(init.delay ?? 0)),
    trackVisibility: Boolean(init.trackVisibility),
    observed: new Set(),
    records: [],
    scheduled: false,
    active: true,
  });
}
export function VisualViewport() { illegalConstructor("VisualViewport"); }

export const observerGeometryConstructors = Object.freeze([
  DOMQuad,
  ResizeObserverSize,
  ResizeObserverEntry,
  ResizeObserver,
  IntersectionObserverEntry,
  IntersectionObserver,
  VisualViewport,
]);
for (const Constructor of observerGeometryConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createVisualViewport() {
  if (visualViewportSingleton !== null) return visualViewportSingleton;
  const value = Object.create(VisualViewport.prototype);
  initializeEventTarget(value);
  const width = Number(globalThis.screen?.width ?? 1280);
  const height = Number(globalThis.screen?.height ?? 720);
  state.set(value, {
    kind: "visualViewport",
    offsetLeft: 0,
    offsetTop: 0,
    pageLeft: 0,
    pageTop: 0,
    width,
    height,
    scale: 1,
    handlers: new Map([
      ["onresize", null],
      ["onscroll", null],
      ["onscrollend", null],
    ]),
  });
  visualViewportSingleton = value;
  return value;
}

export function observerGeometryProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  return record[name];
}

export function setObserverGeometryProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
  }
}

export function observerGeometryOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "quad") {
    if (name === "getBounds") return quadBounds(record);
    if (name === "toJSON") return quadJSON(record);
  }
  if (record.kind === "resizeObserver") {
    return resizeObserverOperation(record, name, args);
  }
  if (record.kind === "intersectionObserver") {
    return intersectionObserverOperation(record, name, args);
  }
  throw new TypeError(`Unsupported observer/geometry operation: ${name}`);
}

function resizeObserverOperation(record, name, args) {
  if (name === "disconnect") {
    record.observed.clear();
    record.active = false;
    return;
  }
  const target = requireBoxTarget(args[0]);
  if (name === "unobserve") {
    record.observed.delete(target);
    return;
  }
  if (name === "observe") {
    record.active = true;
    record.observed.set(target, `${args[1]?.box ?? "content-box"}`);
    scheduleResize(record);
  }
}

function intersectionObserverOperation(record, name, args) {
  if (name === "disconnect") {
    record.observed.clear();
    record.records.length = 0;
    record.active = false;
    return;
  }
  if (name === "takeRecords") return record.records.splice(0);
  const target = requireBoxTarget(args[0]);
  if (name === "unobserve") {
    record.observed.delete(target);
    return;
  }
  if (name === "observe") {
    record.active = true;
    record.observed.add(target);
    record.records.push(createIntersectionEntry(target, record));
    scheduleIntersection(record);
  }
}

function scheduleResize(record) {
  if (record.scheduled) return;
  record.scheduled = true;
  Promise.resolve().then(() => {
    record.scheduled = false;
    if (!record.active || record.observed.size === 0) return;
    const entries = [...record.observed].map(([target, box]) => {
      return createResizeEntry(target, box);
    });
    Reflect.apply(record.callback, undefined, [entries, record.object]);
  });
}

function scheduleIntersection(record) {
  if (record.scheduled) return;
  record.scheduled = true;
  Promise.resolve().then(() => {
    record.scheduled = false;
    if (!record.active || record.records.length === 0) return;
    const entries = record.records.splice(0);
    Reflect.apply(record.callback, undefined, [entries, record.object]);
  });
}

function createResizeEntry(target, box) {
  const rect = target.getBoundingClientRect();
  const content = createSize(rect.width, rect.height);
  const border = createSize(rect.width, rect.height);
  const device = createSize(rect.width, rect.height);
  const value = Object.create(ResizeObserverEntry.prototype);
  state.set(value, {
    kind: "resizeEntry",
    target,
    contentRect: createDOMRect(rect.x, rect.y, rect.width, rect.height),
    contentBoxSize: Object.freeze([content]),
    borderBoxSize: Object.freeze([border]),
    devicePixelContentBoxSize: Object.freeze([device]),
    observedBox: box,
  });
  return value;
}

function createSize(inlineSize, blockSize) {
  const value = Object.create(ResizeObserverSize.prototype);
  state.set(value, {
    kind: "resizeSize",
    inlineSize: Number(inlineSize),
    blockSize: Number(blockSize),
  });
  return value;
}

function createIntersectionEntry(target, observer) {
  const rect = target.getBoundingClientRect();
  const isIntersecting = Boolean(target.isConnected);
  return createInitializedIntersectionEntry({
    time: Number(globalThis.performance?.now() ?? 0),
    rootBounds: observer.root?.getBoundingClientRect?.()
      ?? createDOMRect(0, 0, globalThis.screen?.width ?? 1280, globalThis.screen?.height ?? 720),
    boundingClientRect: rect,
    intersectionRect: isIntersecting ? rect : createDOMRect(),
    isIntersecting,
    isVisible: observer.trackVisibility ? isIntersecting : false,
    intersectionRatio: isIntersecting ? 1 : 0,
    target,
  });
}

function createInitializedIntersectionEntry(init) {
  const value = Object.create(IntersectionObserverEntry.prototype);
  initializeIntersectionEntry(value, init);
  return value;
}

function initializeIntersectionEntry(value, init) {
  if (init === null || typeof init !== "object") {
    throw new TypeError("IntersectionObserverEntry init is required");
  }
  state.set(value, {
    kind: "intersectionEntry",
    time: Number(init.time ?? 0),
    rootBounds: rect(init.rootBounds),
    boundingClientRect: rect(init.boundingClientRect),
    intersectionRect: rect(init.intersectionRect),
    isIntersecting: Boolean(init.isIntersecting),
    isVisible: Boolean(init.isVisible),
    intersectionRatio: Number(init.intersectionRatio ?? 0),
    target: init.target ?? null,
  });
}

function quadBounds(record) {
  const xs = [record.p1.x, record.p2.x, record.p3.x, record.p4.x];
  const ys = [record.p1.y, record.p2.y, record.p3.y, record.p4.y];
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return createDOMRect(
    left,
    top,
    Math.max(...xs) - left,
    Math.max(...ys) - top,
  );
}

function quadJSON(record) {
  return {
    p1: pointJSON(record.p1),
    p2: pointJSON(record.p2),
    p3: pointJSON(record.p3),
    p4: pointJSON(record.p4),
  };
}

function point(value = {}) {
  return createDOMPoint(
    Number(value?.x ?? 0),
    Number(value?.y ?? 0),
    Number(value?.z ?? 0),
    Number(value?.w ?? 1),
  );
}

function pointJSON(value) {
  return { x: value.x, y: value.y, z: value.z, w: value.w };
}

function rect(value = {}) {
  if (value === null) return null;
  return createDOMRect(
    Number(value?.x ?? value?.left ?? 0),
    Number(value?.y ?? value?.top ?? 0),
    Number(value?.width ?? 0),
    Number(value?.height ?? 0),
  );
}

function normalizeThresholds(input) {
  const values = input === undefined
    ? [0]
    : Array.isArray(input)
      ? input.map(Number)
      : [Number(input)];
  if (values.some(value => value < 0 || value > 1 || !Number.isFinite(value))) {
    throw new RangeError("Intersection threshold must be between 0 and 1");
  }
  return Object.freeze([...new Set(values)].sort((a, b) => a - b));
}

function normalizeMargin(value) {
  const parts = `${value ?? "0px"}`.trim().split(/\s+/u);
  if (parts.length === 1) return `${parts[0]} ${parts[0]} ${parts[0]} ${parts[0]}`;
  if (parts.length === 2) return `${parts[0]} ${parts[1]} ${parts[0]} ${parts[1]}`;
  if (parts.length === 3) return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[1]}`;
  return parts.slice(0, 4).join(" ");
}

function requireBoxTarget(value) {
  if (value === null || typeof value !== "object"
    || typeof value.getBoundingClientRect !== "function") {
    throw new TypeError("Observer target must be an Element");
  }
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

function illegalConstructor(name) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    name === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
