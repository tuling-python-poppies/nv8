import { requireElement } from "../dom/element-state.js";
import { initializeAnimationEffect } from "./animation-effect-state.js";

const state = new WeakMap();

export function initializeKeyframeEffect(effect, target, keyframes, options) {
  const normalizedTarget = normalizeTarget(target);
  initializeAnimationEffect(effect, options);
  state.set(effect, {
    target: normalizedTarget,
    pseudoElement: options !== null && typeof options === "object"
      && options.pseudoElement !== undefined
      ? normalizePseudoElement(options.pseudoElement)
      : null,
    composite: options !== null && typeof options === "object"
      && options.composite !== undefined ? `${options.composite}` : "replace",
    keyframes: normalizeKeyframes(keyframes),
  });
}

export function requireKeyframeEffect(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function isKeyframeEffect(value) {
  return state.has(value);
}

export function setKeyframeTarget(effect, value) {
  requireKeyframeEffect(effect).target = normalizeTarget(value);
}

export function setKeyframePseudoElement(effect, value) {
  requireKeyframeEffect(effect).pseudoElement = normalizePseudoElement(value);
}

export function setKeyframeComposite(effect, value) {
  const normalized = `${value}`;
  if (!["replace", "add", "accumulate"].includes(normalized)) {
    throw new TypeError(`Invalid composite value '${normalized}'`);
  }
  requireKeyframeEffect(effect).composite = normalized;
}

export function keyframeEffectFrames(effect) {
  return requireKeyframeEffect(effect).keyframes.map(frame => ({ ...frame }));
}

export function setKeyframeEffectFrames(effect, value) {
  requireKeyframeEffect(effect).keyframes = normalizeKeyframes(value);
}

function normalizeTarget(value) {
  if (value === null) return null;
  try {
    requireElement(value);
  } catch {
    throw new TypeError("target is not an Element");
  }
  return value;
}

function normalizePseudoElement(value) {
  if (value === null || value === undefined) return null;
  const normalized = `${value}`;
  if (!normalized.startsWith("::")) throw new TypeError("Invalid pseudo-element selector");
  return normalized;
}

function normalizeKeyframes(value) {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value.map((frame, index) => normalizeFrame(frame, index, value.length));
  }
  if (typeof value !== "object") throw new TypeError("Keyframes must be an object or sequence");
  const propertyNames = Object.keys(value).filter(name =>
    !["offset", "easing", "composite"].includes(name)
  );
  let count = 0;
  for (const name of propertyNames) {
    const values = Array.isArray(value[name]) ? value[name] : [value[name]];
    count = Math.max(count, values.length);
  }
  if (count === 0) count = 1;
  const frames = Array.from({ length: count }, (_, index) => ({
    offset: count === 1 ? null : index / (count - 1),
    easing: "linear",
    composite: "auto",
  }));
  for (const name of propertyNames) {
    const values = Array.isArray(value[name]) ? value[name] : [value[name]];
    for (let index = 0; index < count; index += 1) {
      frames[index][name] = `${values[Math.min(index, values.length - 1)]}`;
    }
  }
  return frames;
}

function normalizeFrame(value, index, count) {
  const source = value !== null && typeof value === "object" ? value : {};
  const frame = {
    offset: source.offset === undefined
      ? (count <= 1 ? null : index / (count - 1))
      : (source.offset === null ? null : Number(source.offset)),
    easing: source.easing === undefined ? "linear" : `${source.easing}`,
    composite: source.composite === undefined ? "auto" : `${source.composite}`,
  };
  for (const name of Object.keys(source)) {
    if (!["offset", "easing", "composite"].includes(name)) frame[name] = `${source[name]}`;
  }
  return frame;
}
