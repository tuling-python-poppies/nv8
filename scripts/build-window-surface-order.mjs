#!/usr/bin/env node
/**
 * 生成 / 校验 `src/install/window-surface-order.js`。
 *
 * ## 为什么需要这个脚本
 *
 * Window 全局的枚举顺序是指纹的一维：`Object.getOwnPropertyNames(window)` 的
 * 序列在真实 Edge 里是确定的，NV8 必须逐字复现。原来的实现是一份 1.5 万行的
 * 生成代码（`finalize-window-surface-order.js`），把「顺序」这份数据编译进了
 * 三段展开的语句里——**而生成它的工具没有进版本库**。后果是：
 *
 * - 新增一个全局要在三处手改且顺序敏感，没有任何校验；
 * - 版本门控无法表达。`FontFaceSet` 只在 `browserMajorVersion >= 151` 暴露，
 *   因为进不了那份文件，它在 151 profile 下落在**索引 61**（紧随 V8 内建之后），
 *   真实 Edge 是 517——其后 1171 个全局的索引全部偏移 1。
 *
 * 现在顺序是一张数据表，这个脚本负责它与采集 fixture 的一致性。
 *
 * ## 权威来源
 *
 * | 数据 | 来源 |
 * |---|---|
 * | 顺序 | `fixtures/fingerprint/edge-globals.json` 的 `globals`（采集时不排序）|
 * | descriptor 形状 | 同一份 fixture 的 `descriptors`（有则强制校验），否则沿用现表 |
 * | 版本门控 | 现表（按名字继承，脚本不会凭空产生或丢弃门控）|
 *
 * ## 用法
 *
 *   node scripts/build-window-surface-order.mjs           # 校验，不一致则非零退出
 *   node scripts/build-window-surface-order.mjs --write   # 写入
 */

import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { WINDOW_GLOBAL_SHAPES } from '../src/surface/install/window-surface-order.js';

/**
 * V8 引擎自己提供的全局，按真实 Edge 的枚举顺序。
 *
 * 这一段**刻意不进数据表**：它由 V8 注册，NV8 既不安装也不重排。Chromium 与
 * Node 用同一个引擎，实测这 61 项在 NV8 里逐位与真实 Edge 对齐
 * （`Object` → 0、`console` → 60、`Option` → 61）。
 *
 * `console` 排在语言内建之后、WebIDL 接口之前，是 Chromium 的位置，不是 V8 的。
 * 它一并列在这里是因为它同样不由本表管理。
 *
 * `Iterator` 需要 Node 22+，在 18/20 上这段前缀会短一项——那是宿主差异，
 * 已由 `src/baseline/known-differences.js` 登记。
 */
export const V8_BUILTIN_PREFIX = Object.freeze([
  'Object', 'Function', 'Array', 'Number', 'parseFloat', 'parseInt', 'Infinity',
  'NaN', 'undefined', 'Boolean', 'String', 'Symbol', 'Date', 'Promise', 'RegExp',
  'Error', 'AggregateError', 'EvalError', 'RangeError', 'ReferenceError',
  'SyntaxError', 'TypeError', 'URIError', 'globalThis', 'JSON', 'Math', 'Intl',
  'ArrayBuffer', 'Atomics', 'Uint8Array', 'Int8Array', 'Uint16Array',
  'Int16Array', 'Uint32Array', 'Int32Array', 'BigUint64Array', 'BigInt64Array',
  'Uint8ClampedArray', 'Float32Array', 'Float64Array', 'DataView', 'Map',
  'BigInt', 'Set', 'Iterator', 'WeakMap', 'WeakSet', 'Proxy', 'Reflect',
  'FinalizationRegistry', 'WeakRef', 'decodeURI', 'decodeURIComponent',
  'encodeURI', 'encodeURIComponent', 'escape', 'unescape', 'eval', 'isFinite',
  'isNaN', 'console',
]);

/**
 * descriptor 形状。名字就是数据表里出现的标识符。
 *
 * 定义只在数据表里，这里 import——各写一份必然漂移。
 */
export const SHAPE_FLAGS = WINDOW_GLOBAL_SHAPES;

const SHAPE_NAMES = Object.freeze(Object.keys(SHAPE_FLAGS));

/**
 * 把一条采集到的 descriptor 归到形状名。
 *
 * 不做兜底：出现第七种组合就报错，因为静默归到最近的一档正是这类表最容易
 * 出错的地方。
 *
 * @param {{kind: string, writable: boolean|null, enumerable: boolean, configurable: boolean}} descriptor
 * @returns {string}
 */
export function shapeNameOf(descriptor) {
  const accessor = descriptor.kind === 'accessor';
  for (const name of SHAPE_NAMES) {
    const flags = SHAPE_FLAGS[name];
    if (flags.accessor !== accessor) continue;
    if (!accessor && flags.writable !== descriptor.writable) continue;
    if (flags.enumerable !== descriptor.enumerable) continue;
    if (flags.configurable !== descriptor.configurable) continue;
    return name;
  }
  throw new Error(
    `descriptor 组合不在已知形状内：${JSON.stringify(descriptor)}。`
    + '先确认这是真实浏览器的行为，再往 SHAPE_FLAGS 里加一档。'
  );
}

/**
 * 重建数据表的行。
 *
 * @param {object} input
 * @param {string[]} input.fixtureGlobals 采集顺序（含 V8 内建前缀）
 * @param {Record<string, object>|null} input.fixtureDescriptors 采集到的形状，可为 null
 * @param {Array<{name: string, shape: string, gate: object|null}>} input.existingRows 现表
 * @returns {{rows: Array<{name: string, shape: string, gate: object|null}>, notes: string[]}}
 */
export function buildOrderRows({ fixtureGlobals, fixtureDescriptors, existingRows }) {
  const prefix = fixtureGlobals.slice(0, V8_BUILTIN_PREFIX.length);
  if (prefix.join(',') !== V8_BUILTIN_PREFIX.join(',')) {
    throw new Error(
      'fixture 的 V8 内建前缀与 V8_BUILTIN_PREFIX 不一致。'
      + '前缀变了说明引擎侧的注册顺序变了，必须人工核对后再改常量，'
      + `不能顺手对齐。实际前缀：${JSON.stringify(prefix)}`
    );
  }

  const existing = new Map(existingRows.map((row) => [row.name, row]));
  const notes = [];
  const rows = [];

  for (const name of fixtureGlobals.slice(V8_BUILTIN_PREFIX.length)) {
    const prior = existing.get(name) ?? null;
    let shape = null;
    if (fixtureDescriptors !== null && fixtureDescriptors[name] !== undefined) {
      shape = shapeNameOf(fixtureDescriptors[name]);
      if (prior !== null && prior.shape !== shape) {
        notes.push(`${name}: 形状 ${prior.shape} → ${shape}（采集值优先）`);
      }
    } else if (prior !== null) {
      shape = prior.shape;
    } else {
      throw new Error(
        `新增全局 ${name} 没有形状来源。重跑 npm run fingerprint:globals`
        + '（采集器会带上 descriptors），或先在表里手写一行。'
      );
    }
    rows.push({ name, shape, gate: prior?.gate ?? null, note: prior?.note ?? null });
  }

  // fixture 里没有、现表里有的名字。这类项要么被版本门控排除在采集版本之外，
  // 要么是新版 Edge 移掉的——后者必须改成 `{ before: N }` 而不是删掉，否则
  // 换基准时旧 profile 会静默少一个全局。
  const covered = new Set(rows.map((row) => row.name));
  const orphans = existingRows.filter((row) => !covered.has(row.name));
  for (const row of orphans) {
    if (row.gate === null) {
      throw new Error(
        `${row.name} 在现表里但不在采集结果里，且没有版本门控。`
        + '要么它在新基准里被移除（补 { before: N }），'
        + '要么采集不完整。脚本不替你决定。'
      );
    }
    // 锚定在现表里的前驱之后，保持原相对位置。
    const index = existingRows.indexOf(row);
    let anchor = -1;
    for (let i = index - 1; i >= 0; i -= 1) {
      anchor = rows.findIndex((candidate) => candidate.name === existingRows[i].name);
      if (anchor !== -1) break;
    }
    rows.splice(anchor + 1, 0, { ...row });
    notes.push(`${row.name}: 采集版本无此全局，按门控 ${JSON.stringify(row.gate)} 保留`);
  }

  return { rows, notes };
}

/**
 * 从数据表源码里解析出行。写回时靠它继承形状、门控与行注释。
 *
 * 行注释一并解析是有意的：「这一行为什么特殊」如果只活在 git log 里，
 * 下一次重新生成就没了。
 */
export function parseOrderRows(source) {
  const body = /export const WINDOW_GLOBAL_ORDER = Object\.freeze\(\[\n([\s\S]*?)\n\]\);/
    .exec(source);
  if (body === null) throw new Error('数据表里找不到 WINDOW_GLOBAL_ORDER');
  const rows = [];
  let pending = [];
  for (const line of body[1].split('\n')) {
    const text = line.trim();
    if (text === '') continue;
    if (text.startsWith('//')) {
      pending.push(text.replace(/^\/\/ ?/, ''));
      continue;
    }
    const match = /^\["((?:[^"\\]|\\.)*)", (\w+)(?:, (\{.*\}))?\],$/.exec(text);
    if (match === null) throw new Error(`数据表这一行解析不了：${line}`);
    rows.push({
      name: JSON.parse(`"${match[1]}"`),
      shape: match[2],
      gate: match[3] === undefined ? null : parseGate(match[3]),
      note: pending.length === 0 ? null : pending.join('\n'),
    });
    pending = [];
  }
  if (pending.length > 0) throw new Error(`表尾有悬空注释：${pending.join(' / ')}`);
  return rows;
}

function parseGate(text) {
  const gate = {};
  for (const [, key, value] of text.matchAll(/(since|before): (\d+)/g)) {
    gate[key] = Number(value);
  }
  const pending = /pending: ("(?:[^"\\]|\\.)*")/.exec(text);
  if (pending !== null) gate.pending = JSON.parse(pending[1]);
  if (Object.keys(gate).length === 0) throw new Error(`门控解析不了：${text}`);
  return gate;
}

function formatGate(gate) {
  const parts = [];
  if (gate.since !== undefined) parts.push(`since: ${gate.since}`);
  if (gate.before !== undefined) parts.push(`before: ${gate.before}`);
  if (gate.pending !== undefined) parts.push(`pending: ${JSON.stringify(gate.pending)}`);
  return `{ ${parts.join(', ')} }`;
}

/** 渲染数据表文件。 */
export function renderOrderTable({ rows, header }) {
  const lines = rows.map((row) => {
    const gate = row.gate === null ? '' : `, ${formatGate(row.gate)}`;
    const entry = `["${row.name}", ${row.shape}${gate}],`;
    if (row.note === null || row.note === undefined) return entry;
    const note = row.note.split('\n').map((text) => `// ${text}`).join('\n');
    return `${note}\n${entry}`;
  });
  return `${header}export const WINDOW_GLOBAL_ORDER = Object.freeze([\n${lines.join('\n')}\n]);\n`;
}

// ------------------------------------------------------------------ CLI

const TABLE_URL = new URL('../src/surface/install/window-surface-order.js', import.meta.url);
const FIXTURE_URL = new URL('../fixtures/fingerprint/edge-globals.json', import.meta.url);

async function main() {
  const write = process.argv.includes('--write');
  const source = await readFile(TABLE_URL, 'utf8');
  const fixture = JSON.parse(await readFile(FIXTURE_URL, 'utf8'));
  const header = source.slice(0, source.indexOf('export const WINDOW_GLOBAL_ORDER'));

  const { rows, notes } = buildOrderRows({
    fixtureGlobals: fixture.globals,
    fixtureDescriptors: fixture.descriptors ?? null,
    existingRows: parseOrderRows(source),
  });
  for (const note of notes) console.log(`注意：${note}`);
  if (fixture.descriptors === undefined) {
    console.log(
      '注意：fixture 里没有 descriptors 字段，形状沿用现表未做校验。'
      + '重跑 npm run fingerprint:globals 会带上它。'
    );
  }

  const rebuilt = renderOrderTable({ rows, header });
  if (rebuilt === source) {
    console.log(`数据表与 fixture 一致：${rows.length} 项`);
    return;
  }
  if (!write) {
    console.error(
      `数据表与 fixture 不一致（现表 ${parseOrderRows(source).length} 项，`
      + `重建 ${rows.length} 项）。跑 --write 写入后人工 diff。`
    );
    process.exitCode = 1;
    return;
  }
  await writeFile(TABLE_URL, rebuilt, 'utf8');
  console.log(`已写入 ${fileURLToPath(TABLE_URL)}：${rows.length} 项`);
}

if (process.argv[1] !== undefined
  && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
