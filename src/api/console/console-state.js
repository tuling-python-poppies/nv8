const consoleState = {
  records: [],
  counters: new Map(),
  timers: new Map(),
  groupDepth: 0,
};

let consoleObject = null;
let memoryObject = null;

export function currentConsole() {
  if (consoleObject === null) {
    consoleObject = {};
    Object.defineProperty(consoleObject, Symbol.toStringTag, {
      value: "console",
      configurable: true,
    });
  }
  return consoleObject;
}

export function currentMemoryInfo() {
  return memoryObject;
}

export function setMemoryInfo(value) {
  memoryObject = value;
}

export function appendConsoleRecord(level, values) {
  consoleState.records.push({
    level,
    values: values.slice(),
    groupDepth: consoleState.groupDepth,
  });
}

export function readConsoleRecords() {
  return consoleState.records.map((record) => ({
    level: record.level,
    values: record.values.slice(),
    groupDepth: record.groupDepth,
  }));
}

export function clearConsoleRecords() {
  consoleState.records.length = 0;
}

export function consoleCount(label) {
  const next = (consoleState.counters.get(label) ?? 0) + 1;
  consoleState.counters.set(label, next);
  return next;
}

export function consoleCountReset(label) {
  consoleState.counters.delete(label);
}

export function consoleTimerStart(label) {
  if (!consoleState.timers.has(label)) {
    consoleState.timers.set(label, performance.now());
  }
}

export function consoleTimerRead(label, remove) {
  const start = consoleState.timers.get(label);
  if (start === undefined) {
    return null;
  }
  const elapsed = performance.now() - start;
  if (remove) {
    consoleState.timers.delete(label);
  }
  return elapsed;
}

export function consoleGroupStart() {
  consoleState.groupDepth += 1;
}

export function consoleGroupEnd() {
  consoleState.groupDepth = Math.max(0, consoleState.groupDepth - 1);
}
