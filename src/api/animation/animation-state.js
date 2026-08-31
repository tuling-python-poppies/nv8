import { initializeEventTarget } from "../event/event-target-state.js";
import { requireNode } from "../dom/node-state.js";
import { isAnimationEffect } from "./animation-effect-state.js";
import { defaultDocumentTimeline, isAnimationTimeline } from "./animation-timeline-state.js";
import { isKeyframeEffect, requireKeyframeEffect } from "./keyframe-effect-state.js";

const state = new WeakMap();
import { createRealmSlot } from "../../core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const animationSlot = createRealmSlot(() => ({
  nextSequence: 0,
}), "animation");

function animationSlotState() {
  return animationSlot.get(globalThis);
}
const animations = [];

export function initializeAnimation(animation, effect = null, timeline = undefined) {
  initializeEventTarget(animation);
  const normalizedEffect = normalizeEffect(effect);
  const normalizedTimeline = timeline === undefined
    ? defaultDocumentTimeline()
    : normalizeTimeline(timeline);
  state.set(animation, {
    object: animation,
    sequence: animationSlotState().nextSequence,
    effect: normalizedEffect,
    timeline: normalizedTimeline,
    startTime: null,
    currentTime: null,
    playbackRate: 1,
    rangeStart: "normal",
    rangeEnd: "normal",
    playState: "idle",
    replaceState: "active",
    pending: false,
    id: "",
    onfinish: null,
    oncancel: null,
    onremove: null,
    finished: Promise.resolve(animation),
    ready: Promise.resolve(animation),
  });
  animationSlotState().nextSequence += 1;
  animations.push(animation);
}

export function requireAnimation(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function setAnimationProperty(animation, name, value) {
  const record = requireAnimation(animation);
  switch (name) {
    case "effect":
      record.effect = normalizeEffect(value);
      break;
    case "timeline":
      record.timeline = normalizeTimeline(value);
      break;
    case "startTime":
    case "currentTime":
      record[name] = nullableFiniteNumber(value, name);
      break;
    case "playbackRate":
      record.playbackRate = finiteNumber(value, name);
      break;
    case "rangeStart":
    case "rangeEnd":
    case "id":
      record[name] = `${value}`;
      break;
    case "onfinish":
    case "oncancel":
    case "onremove":
      record[name] = typeof value === "function" ? value : null;
      break;
    default:
      throw new TypeError(`Unknown Animation property '${name}'`);
  }
}

export function cancelAnimation(animation) {
  const record = requireAnimation(animation);
  record.playState = "idle";
  record.currentTime = null;
  record.startTime = null;
  record.pending = false;
  dispatchAnimationEvent(record, "cancel", "oncancel");
}

export function commitAnimationStyles(animation) {
  requireAnimation(animation).pending = false;
}

export function finishAnimation(animation) {
  const record = requireAnimation(animation);
  record.playState = "finished";
  record.pending = false;
  record.currentTime = effectEndTime(record.effect);
  dispatchAnimationEvent(record, "finish", "onfinish");
}

export function pauseAnimation(animation) {
  const record = requireAnimation(animation);
  record.playState = "paused";
  record.pending = false;
}

export function persistAnimation(animation) {
  requireAnimation(animation).replaceState = "persisted";
}

export function playAnimation(animation) {
  const record = requireAnimation(animation);
  record.playState = "running";
  record.pending = false;
  if (record.currentTime === null) record.currentTime = 0;
}

export function reverseAnimation(animation) {
  const record = requireAnimation(animation);
  record.playbackRate = -record.playbackRate;
  record.playState = "running";
  record.pending = false;
}

export function updateAnimationPlaybackRate(animation, value) {
  requireAnimation(animation).playbackRate = finiteNumber(value, "playbackRate");
}

export function animationOverallProgress(animation) {
  const record = requireAnimation(animation);
  if (record.currentTime === null) return null;
  const endTime = effectEndTime(record.effect);
  if (endTime <= 0) return Math.max(0, record.currentTime);
  return Math.min(1, Math.max(0, record.currentTime / endTime));
}

export function animationsForElement(element) {
  return animations
    .filter(animation => {
      const record = state.get(animation);
      if (record === undefined || record.playState === "idle" || record.replaceState === "removed") {
        return false;
      }
      return isKeyframeEffect(record.effect)
        && requireKeyframeEffect(record.effect).target === element;
    })
    .sort((left, right) => requireAnimation(left).sequence - requireAnimation(right).sequence);
}

export function animationsForDocument(document) {
  return animations
    .filter(animation => {
      const record = state.get(animation);
      if (record === undefined || record.playState === "idle" || record.replaceState === "removed") {
        return false;
      }
      if (!isKeyframeEffect(record.effect)) return false;
      const target = requireKeyframeEffect(record.effect).target;
      return target !== null
        && requireNode(target).ownerDocument === document
        && isConnected(target);
    })
    .sort((left, right) => requireAnimation(left).sequence - requireAnimation(right).sequence);
}

function normalizeEffect(value) {
  if (value === null || value === undefined) return null;
  if (!isAnimationEffect(value)) throw new TypeError("effect is not an AnimationEffect");
  return value;
}

function normalizeTimeline(value) {
  if (value === null) return null;
  if (!isAnimationTimeline(value)) throw new TypeError("timeline is not an AnimationTimeline");
  return value;
}

function finiteNumber(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be finite`);
  return number;
}

function nullableFiniteNumber(value, name) {
  return value === null ? null : finiteNumber(value, name);
}

function effectEndTime(effect) {
  if (!isAnimationEffect(effect)) return 0;
  const timing = effect.getComputedTiming();
  return Number(timing.endTime) || 0;
}

function dispatchAnimationEvent(record, type, handlerName) {
  const event = new Event(type);
  record.object.dispatchEvent(event);
  const handler = record[handlerName];
  if (handler !== null) Reflect.apply(handler, record.object, [event]);
}

function isConnected(node) {
  let current = node;
  while (current !== null) {
    if (requireNode(current).nodeType === 9) return true;
    current = requireNode(current).parent;
  }
  return false;
}
