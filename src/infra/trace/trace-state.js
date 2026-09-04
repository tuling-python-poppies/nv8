const traceState = {
  enabled: false,
  maxEntries: 100_000,
  nextSequence: 1,
  entries: [],
  startIndex: 0,
  size: 0,
};

export function configureTrace(enabled, maxEntries) {
  traceState.enabled = Boolean(enabled);
  if (Number.isSafeInteger(maxEntries) && maxEntries > 0) {
    traceState.maxEntries = maxEntries;
  }
  clearTrace();
}

export function enableTrace() {
  traceState.enabled = true;
}

export function disableTrace() {
  traceState.enabled = false;
}

export function clearTrace() {
  traceState.entries.length = 0;
  traceState.startIndex = 0;
  traceState.size = 0;
  traceState.nextSequence = 1;
}

export function traceIsEnabled() {
  return traceState.enabled;
}

export function appendTrace(operation, api, receiver, argumentsSummary, result) {
  if (!traceState.enabled) {
    return;
  }
  const entry = {
    sequence: traceState.nextSequence,
    operation,
    api,
    receiver,
    arguments: argumentsSummary,
    result,
  };
  traceState.nextSequence += 1;
  if (traceState.size < traceState.maxEntries) {
    traceState.entries.push(entry);
    traceState.size += 1;
    return;
  }
  traceState.entries[traceState.startIndex] = entry;
  traceState.startIndex = (
    traceState.startIndex + 1
  ) % traceState.maxEntries;
}

export function readTrace() {
  if (
    traceState.size < traceState.maxEntries
    || traceState.startIndex === 0
  ) {
    return traceState.entries.slice(0, traceState.size);
  }
  return [
    ...traceState.entries.slice(traceState.startIndex),
    ...traceState.entries.slice(0, traceState.startIndex),
  ];
}
