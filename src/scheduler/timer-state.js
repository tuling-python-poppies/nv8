import {
  monotonicNow,
  timingProfile,
  wallClockNow,
} from "./monotonic-clock.js";

let nextTimerId = 1;
const tasks = new Map();
let cachedEarliestDue = Infinity;
let cachedEarliestDirty = false;

function trackEarliest(dueTime) {
  if (dueTime < cachedEarliestDue) {
    cachedEarliestDue = dueTime;
  }
}

function invalidateEarliest() {
  cachedEarliestDirty = true;
}

function recomputeEarliest() {
  if (!cachedEarliestDirty) return;
  cachedEarliestDirty = false;
  let earliest = Infinity;
  for (const task of tasks.values()) {
    if (task.dueTime < earliest) earliest = task.dueTime;
  }
  cachedEarliestDue = earliest;
}

export function reserveTimer(callback, delay, callbackArguments, repeat) {
  const id = allocateTimerId();
  const normalizedDelay = Math.max(
    normalizeDelay(delay),
    timingProfile().minimumTimerDelayMs,
  );
  const dueTime = wallClockNow() + normalizedDelay;
  tasks.set(id, {
    id,
    kind: repeat ? "interval" : "timeout",
    callback: normalizeTimerCallback(callback),
    callbackArguments,
    delay: normalizedDelay,
    dueTime,
  });
  trackEarliest(dueTime);
  return id;
}

export function reserveAnimationFrame(callback) {
  const id = allocateTimerId();
  const delay = timingProfile().animationFrameIntervalMs;
  const dueTime = wallClockNow() + delay;
  tasks.set(id, {
    id,
    kind: "animation-frame",
    callback,
    callbackArguments: [],
    delay,
    dueTime,
  });
  trackEarliest(dueTime);
  return id;
}

export function cancelTimer(id) {
  const number = Number(id);
  if (Number.isFinite(number)) {
    if (tasks.delete(Math.trunc(number))) {
      invalidateEarliest();
    }
  }
}

export function nextTimerDelay() {
  if (tasks.size === 0) {
    return null;
  }
  recomputeEarliest();
  return Math.max(0, cachedEarliestDue - wallClockNow());
}

export function runDueTimers() {
  if (tasks.size === 0) return;
  const now = wallClockNow();
  recomputeEarliest();
  if (cachedEarliestDue > now) return;
  const due = [];
  for (const task of tasks.values()) {
    if (task.dueTime <= now) {
      due.push(task);
    }
  }
  if (due.length > 1) {
    due.sort((left, right) => (
      left.dueTime - right.dueTime || left.id - right.id
    ));
  }
  for (const task of due) {
    if (!tasks.has(task.id)) {
      continue;
    }
    if (task.kind === "interval") {
      task.dueTime = now + Math.max(1, task.delay);
    } else {
      tasks.delete(task.id);
    }
    try {
      if (task.kind === "animation-frame") {
        Reflect.apply(task.callback, globalThis, [monotonicNow()]);
      } else {
        Reflect.apply(task.callback, globalThis, task.callbackArguments);
      }
    } catch {
      // A browser reports timer callback errors without rejecting the task itself.
    }
  }
  // After executing timers some were removed or rescheduled.
  invalidateEarliest();
}

export function clearAllTimers() {
  tasks.clear();
  cachedEarliestDue = Infinity;
  cachedEarliestDirty = false;
}

function allocateTimerId() {
  const start = nextTimerId;
  while (tasks.has(nextTimerId)) {
    nextTimerId = nextTimerId === 0x7fffffff ? 1 : nextTimerId + 1;
    if (nextTimerId === start) {
      throw new RangeError("No timer identifiers are available");
    }
  }
  const id = nextTimerId;
  nextTimerId = nextTimerId === 0x7fffffff ? 1 : nextTimerId + 1;
  return id;
}

function normalizeDelay(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  const int32 = number >> 0;
  return Math.max(0, int32);
}

function normalizeTimerCallback(value) {
  if (typeof value === "function") {
    return value;
  }
  const source = `${value}`;
  return Function(source);
}
