import { AnimationTimeline } from "../animation/animation-timeline-constructor.js";
import {
  initializeAnimationTimeline,
} from "../animation/animation-timeline-state.js";
import { CSSUnitValue } from "../css/css-typed-om-constructors.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function ScrollTimeline() {
  if (new.target === undefined) {
    throw new TypeError("ScrollTimeline requires new");
  }
  const options = arguments[0] ?? {};
  initializeTimeline(this, {
    kind: "scroll",
    source: options.source ?? defaultSource(),
    axis: normalizeAxis(options.axis),
  });
}

export function ViewTimeline() {
  if (new.target === undefined) {
    throw new TypeError("ViewTimeline requires new");
  }
  const options = arguments[0] ?? {};
  const subject = options.subject ?? null;
  initializeTimeline(this, {
    kind: "view",
    source: subject?.parentElement ?? defaultSource(),
    subject,
    axis: normalizeAxis(options.axis),
    startOffset: new CSSUnitValue(0, "px"),
    endOffset: new CSSUnitValue(0, "px"),
  });
}

registerNativeFunction(ScrollTimeline, "ScrollTimeline");
registerNativeFunction(ViewTimeline, "ViewTimeline");
export const scrollTimelineConstructors = Object.freeze([
  ScrollTimeline,
  ViewTimeline,
]);

export function scrollTimelineProperty(value, name) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record[name];
}

function initializeTimeline(value, record) {
  initializeAnimationTimeline(
    value,
    new CSSUnitValue(0, "percent"),
    new CSSUnitValue(100, "percent"),
  );
  state.set(value, record);
}

function defaultSource() {
  return globalThis.document?.scrollingElement
    ?? globalThis.document?.documentElement
    ?? null;
}

function normalizeAxis(value = "block") {
  const axis = `${value}`;
  if (!["block", "inline", "x", "y"].includes(axis)) {
    throw new TypeError("Invalid timeline axis");
  }
  return axis;
}

export { AnimationTimeline };
