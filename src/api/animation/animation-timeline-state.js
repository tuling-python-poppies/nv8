import { AnimationTimeline } from "./animation-timeline-constructor.js";
import { DocumentTimeline } from "./document-timeline-constructor.js";
import { createRealmSlot } from "../../core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const timelineSlot = createRealmSlot(() => ({
  defaultTimeline: null,
}), "timeline");

function timelineState() {
  return timelineSlot.get(globalThis);
}

const state = new WeakMap();

export function initializeAnimationTimeline(timeline, currentTime = 0, duration = null) {
  state.set(timeline, { currentTime, duration });
}

export function requireAnimationTimeline(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function isAnimationTimeline(value) {
  return state.has(value);
}

export function createDocumentTimeline(originTime = 0) {
  const timeline = Object.create(DocumentTimeline.prototype);
  initializeAnimationTimeline(timeline, -originTime, null);
  return timeline;
}

export function defaultDocumentTimeline() {
  if (timelineState().defaultTimeline === null) timelineState().defaultTimeline = createDocumentTimeline(0);
  return timelineState().defaultTimeline;
}

export function createAnimationTimeline(currentTime = null, duration = null) {
  const timeline = Object.create(AnimationTimeline.prototype);
  initializeAnimationTimeline(timeline, currentTime, duration);
  return timeline;
}
