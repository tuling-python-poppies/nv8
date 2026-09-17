/**
 * Canonical JSON
 *
 * 用于工件摘要和 lock 计算的确定性序列化：
 * - 对象键按 code unit 升序排列
 * - 数组保持顺序
 * - 拒绝 undefined、函数、Symbol、NaN、Infinity 和循环引用
 * - 不产生多余空白
 *
 * 该实现刻意与 `JSON.stringify` 的宽松行为不同：任何不可确定性表示的值
 * 都会抛错，而不是被静默丢弃。
 */

import { createHash } from 'node:crypto';

const MAX_DEPTH = 64;

function fail(reason, path) {
  const where = path.length > 0 ? ` at ${path.join('.')}` : '';
  throw new TypeError(`canonicalJson: ${reason}${where}`);
}

function encode(value, path, depth, seen) {
  if (depth > MAX_DEPTH) fail('max depth exceeded', path);

  if (value === null) return 'null';

  const type = typeof value;

  if (type === 'boolean') return value ? 'true' : 'false';

  if (type === 'number') {
    if (!Number.isFinite(value)) fail(`non-finite number (${value})`, path);
    // -0 归一化为 0，避免同值不同摘要
    return JSON.stringify(value === 0 ? 0 : value);
  }

  if (type === 'bigint') fail('bigint is not representable', path);
  if (type === 'string') return JSON.stringify(value);
  if (type === 'undefined') fail('undefined is not representable', path);
  if (type === 'function') fail('function is not representable', path);
  if (type === 'symbol') fail('symbol is not representable', path);

  if (seen.has(value)) fail('circular reference', path);
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      // 必须按索引循环：`Array.prototype.map` 会跳过稀疏数组的空洞，
      // join 之后产出 "[1,,3]" 这种非法 JSON，且与 [1,null,3] 摘要不同。
      // 空洞按 null 输出，与 JSON.stringify 对齐。
      const items = [];
      for (let index = 0; index < value.length; index += 1) {
        items.push(index in value
          ? encode(value[index], [...path, String(index)], depth + 1, seen)
          : 'null');
      }
      return `[${items.join(',')}]`;
    }

    const proto = Object.getPrototypeOf(value);
    if (proto !== null && proto !== Object.prototype) {
      fail(`unsupported object prototype (${proto?.constructor?.name ?? 'unknown'})`, path);
    }

    const keys = Object.keys(value).sort();
    const parts = [];
    for (const key of keys) {
      const entry = value[key];
      // 与 JSON.stringify 一致：显式 undefined 属性被省略
      if (entry === undefined) continue;
      parts.push(`${JSON.stringify(key)}:${encode(entry, [...path, key], depth + 1, seen)}`);
    }
    return `{${parts.join(',')}}`;
  } finally {
    seen.delete(value);
  }
}

/**
 * 序列化为 canonical JSON 字符串
 * @param {unknown} value
 * @returns {string}
 */
export function canonicalJson(value) {
  return encode(value, [], 0, new Set());
}

/** 校验一次并取得独立、递归冻结的数据快照；不冻结调用方对象。 */
export function canonicalSnapshot(value) {
  const freeze = item => {
    if (item !== null && typeof item === 'object') {
      for (const child of Object.values(item)) freeze(child);
      Object.freeze(item);
    }
    return item;
  };
  return freeze(JSON.parse(canonicalJson(value)));
}

/**
 * 计算 canonical JSON 的 sha256 摘要
 * @param {unknown} value
 * @returns {string} hex digest
 */
export function canonicalDigest(value) {
  return createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
}

/**
 * canonical JSON 的字节长度
 * @param {unknown} value
 * @returns {number}
 */
export function canonicalByteLength(value) {
  return Buffer.byteLength(canonicalJson(value), 'utf8');
}
