export function toDOMString(value) {
  if (typeof value === "symbol") {
    throw new TypeError("Cannot convert a Symbol value to a string");
  }
  return `${value}`;
}

export function toBoolean(value) {
  return Boolean(value);
}

export function toEventListenerOptions(value) {
  if (value === undefined || value === null) {
    return {
      capture: false,
      once: false,
      passive: false,
      signal: null,
    };
  }
  if (typeof value === "boolean") {
    return {
      capture: value,
      once: false,
      passive: false,
      signal: null,
    };
  }
  const source = Object(value);
  return {
    capture: Boolean(source.capture),
    once: Boolean(source.once),
    passive: Boolean(source.passive),
    signal: source.signal ?? null,
  };
}

export function toEventInit(value) {
  if (value === undefined || value === null) {
    return {
      bubbles: false,
      cancelable: false,
      composed: false,
    };
  }
  const source = Object(value);
  return {
    bubbles: Boolean(source.bubbles),
    cancelable: Boolean(source.cancelable),
    composed: Boolean(source.composed),
  };
}

/**
 * WebIDL 实参个数检查。
 *
 * 真实 Chromium 的文案是固定模板（实测）：
 *
 * ```
 * Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only 0 present.
 * Failed to execute 'getElementById' on 'Document': 1 argument required, but only 0 present.
 * ```
 *
 * 注意单复数：1 个是 `argument`，多个是 `arguments`。文案本身就是可检测特征，
 * 少一个句点或写成 `1 arguments` 都会露馅。
 *
 * 迁移前多数方法**完全不检查**实参个数——`document.addEventListener()` 静默
 * 返回 undefined，真实浏览器抛 TypeError。
 *
 * @param {number} required 必需实参个数
 * @param {number} actual 实际传入个数
 * @param {string} method 方法名
 * @param {string} interfaceName 接口名
 */
export function requireArguments(required, actual, method, interfaceName) {
  if (actual >= required) return;
  const noun = required === 1 ? 'argument' : 'arguments';
  throw new TypeError(
    `Failed to execute '${method}' on '${interfaceName}': `
    + `${required} ${noun} required, but only ${actual} present.`,
  );
}
