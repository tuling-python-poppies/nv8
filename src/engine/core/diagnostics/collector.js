/**
 * Bounded, JSON-safe diagnostics collector shared by Core plugin contexts.
 */
const MAX_SANITIZE_DEPTH = 8;

export class DiagnosticsCollector {
  constructor(options = {}) {
    this._maxEntries = Number.isSafeInteger(options.maxEntries)
      ? Math.max(1, options.maxEntries)
      : 10_000;
    this._items = [];
    // 环形缓冲的逻辑起点：_items 写满后，_head 指向最旧条目。
    // 用覆盖代替 shift()，把 O(n) 的头部删除降为 O(1)（IKF39T）。
    this._head = 0;
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
    return this._snapshot();
  }

  getWarnings() {
    return this._snapshot().filter(item => item.level === 'warn');
  }

  getErrors() {
    return this._snapshot().filter(item => item.level === 'error');
  }

  getPluginItems(pluginId) {
    return this._snapshot().filter(item => item.pluginId === pluginId);
  }

  clear() {
    this._items.length = 0;
    this._head = 0;
  }

  /**
   * 按时间顺序取全部条目的浅拷贝。
   *
   * @returns {object[]}
   */
  _snapshot() {
    const length = this._items.length;
    if (this._head === 0) return this._items.map(item => ({ ...item }));
    const output = new Array(length);
    for (let index = 0; index < length; index += 1) {
      output[index] = { ...this._items[(this._head + index) % length] };
    }
    return output;
  }

  _append(level, data) {
    const entry = Object.freeze({
      ...sanitize(data),
      level,
      timestamp: Date.now(),
    });
    if (this._items.length < this._maxEntries) {
      this._items.push(entry);
      return;
    }
    this._items[this._head] = entry;
    this._head = (this._head + 1) % this._maxEntries;
  }
}

/**
 * 把任意数据压成 JSON 安全的浅层结构。
 *
 * 环检测 + 最大深度是必须的：诊断采集的输入可能包含页面对象的循环引用
 * （如 `window.self` / 组件互相持有），递归下去会栈溢出（IKF39T）。
 *
 * @param {object} data
 * @param {number} [depth]
 * @param {WeakSet<object>} [seen] 当前递归路径上的对象
 * @returns {object}
 */
function sanitize(data, depth = 0, seen = new WeakSet()) {
  const output = {};
  if (data === null || typeof data !== 'object') return output;
  for (const [key, value] of Object.entries(data)) {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
      output[key] = value;
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      output[key] = value;
    } else if (Array.isArray(value)) {
      output[key] = sanitizeArray(value);
    } else if (value && typeof value === 'object') {
      if (depth >= MAX_SANITIZE_DEPTH) {
        output[key] = '[Truncated]';
        continue;
      }
      if (seen.has(value)) {
        output[key] = '[Circular]';
        continue;
      }
      seen.add(value);
      output[key] = sanitize(value, depth + 1, seen);
      seen.delete(value);
    }
  }
  return output;
}

function sanitizeArray(value) {
  // 数组元素按原行为字符串化对象，天然不会递归进循环引用
  return value.slice(0, 32).map(item => (
    item === null || typeof item === 'string' || typeof item === 'number'
      || typeof item === 'boolean'
      ? item
      : String(item)
  ));
}
