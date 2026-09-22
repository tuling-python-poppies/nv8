export function createLifecycleRecorder(options = {}) {
  const maxEntries = Number.isSafeInteger(options.maxEntries)
    ? Math.max(1, options.maxEntries)
    : 10_000;
  const entries = [];
  return {
    emit(name, data = {}) {
      if (entries.length >= maxEntries) entries.shift();
      entries.push(Object.freeze({
        ...sanitize(data),
        name,
        timestamp: Date.now(),
      }));
    },
    snapshot() {
      return entries.map(entry => ({ ...entry }));
    },
    clear() {
      entries.length = 0;
    },
  };
}

function sanitize(value) {
  const output = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === null || typeof item === 'string' || typeof item === 'boolean') {
      output[key] = item;
    } else if (typeof item === 'number' && Number.isFinite(item)) {
      output[key] = item;
    } else if (Array.isArray(item)) {
      output[key] = item.slice(0, 32).map(entry => (
        typeof entry === 'string' || typeof entry === 'number' ? entry : String(entry)
      ));
    }
  }
  return output;
}
