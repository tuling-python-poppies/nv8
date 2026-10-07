import { createRealmSlot } from "../../../engine/core/state-scope.js";

const consoleStateSlot = createRealmSlot(() => ({
  consoleObject: null,
  memoryObject: null,
  records: [],
  counters: new Map(),
  timers: new Map(),
  groupDepth: 0,
}), "console-state");

function state() {
  return consoleStateSlot.get(globalThis);
}

export function currentConsole() {
  const current = state();
  if (current.consoleObject === null) {
    current.consoleObject = {};
    Object.defineProperty(current.consoleObject, Symbol.toStringTag, {
      value: "console",
      configurable: true,
    });
  }
  return current.consoleObject;
}

export function currentMemoryInfo() {
  return state().memoryObject;
}

export function setMemoryInfo(value) {
  state().memoryObject = value;
}

export function appendConsoleRecord(level, values) {
  const current = state();
  current.records.push({
    level,
    values: values.slice(),
    groupDepth: current.groupDepth,
  });
}

export function clearConsoleRecords() {
  state().records.length = 0;
}

export function consoleCount(label) {
  const current = state();
  const next = (current.counters.get(label) ?? 0) + 1;
  current.counters.set(label, next);
  return next;
}

export function consoleCountReset(label) {
  state().counters.delete(label);
}

export function consoleTimerStart(label) {
  const current = state();
  if (!current.timers.has(label)) {
    current.timers.set(label, performance.now());
  }
}

export function consoleTimerRead(label, remove) {
  const current = state();
  const start = current.timers.get(label);
  if (start === undefined) {
    return null;
  }
  const elapsed = performance.now() - start;
  if (remove) {
    current.timers.delete(label);
  }
  return elapsed;
}

export function consoleGroupStart() {
  state().groupDepth += 1;
}

export function consoleGroupEnd() {
  const current = state();
  current.groupDepth = Math.max(0, current.groupDepth - 1);
}
