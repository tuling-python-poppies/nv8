/**
 * Bounded, JSON-safe diagnostics collector shared by Core plugin contexts.
 */
export class DiagnosticsCollector {
  constructor(options = {}) {
    this._maxEntries = Number.isSafeInteger(options.maxEntries)
      ? Math.max(1, options.maxEntries)
      : 10_000;
    this._items = [];
  }

  warn(data = {}) {
    this._append('warn', data);
  }

  error(data = {}) {
    this._append('error', data);
  }

  record(error, context = {}) {
    this.error({
      code: error?.code || 'ERR_NV8_UNKNOWN',
      message: `${error?.message || error}`,
      context,
    });
  }

  getAll() {
    return this._items.map(item => ({ ...item }));
  }

  getWarnings() {
    return this._items.filter(item => item.level === 'warn')
      .map(item => ({ ...item }));
  }

  getErrors() {
    return this._items.filter(item => item.level === 'error')
      .map(item => ({ ...item }));
  }

  getPluginItems(pluginId) {
    return this._items.filter(item => item.pluginId === pluginId)
      .map(item => ({ ...item }));
  }

  clear() {
    this._items.length = 0;
  }

  _append(level, data) {
    if (this._items.length >= this._maxEntries) this._items.shift();
    this._items.push(Object.freeze({
      level,
      timestamp: Date.now(),
      ...sanitize(data),
    }));
  }
}

function sanitize(data) {
  const output = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
      output[key] = value;
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      output[key] = value;
    } else if (Array.isArray(value)) {
      output[key] = value.slice(0, 32).map(item => (
        item === null || typeof item === 'string' || typeof item === 'number'
          || typeof item === 'boolean'
          ? item
          : String(item)
      ));
    } else if (value && typeof value === 'object') {
      output[key] = sanitize(value);
    }
  }
  return output;
}
