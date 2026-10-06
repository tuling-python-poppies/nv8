#!/usr/bin/env node
/**
 * 一次性迁移：把 `src/surface/install/**` 里被机械摊平的安装代码还原成人能读的形态。
 *
 * 摊平来自一轮把「遍历 WebIDL 表」展开成语句的机械变换，留下四类残留：
 *
 *   R1  内联数组字面量被常量下标取值   `((([A, B, C])[1]))`  → `B`
 *   R2  空转循环包住一段语句           `do { X } while (false);` → `X`
 *   R3  只包了一个子块的裸块           `{ { X } }`            → `{ X }`
 *   R4  简单表达式外面多余的小括号      `delete (Crypto)`      → `delete Crypto`
 *
 * 四类变换都不改变求值顺序、不改变作用域：R2/R3 只在块内没有 `let/const/class/function`
 * 声明、且块处在语句列表位置时才去掉花括号；R4 只处理「行中间、前面不是标识符」的简单
 * 表达式，避开行首小括号改变自动分号插入、以及调用/成员访问括号被误删这两种情况。
 *
 * 安全网是仓库自带的两样东西：`npm test`（1300+ 用例）与
 * `node --experimental-vm-modules scripts/capture-full-surface.mjs`（与 baseline 逐项比对）。
 *
 * 用法：
 *   node scripts/deflatten-install-surface.mjs --self-test
 *   node scripts/deflatten-install-surface.mjs            # 只报告会改哪些文件
 *   node scripts/deflatten-install-surface.mjs --write    # 落盘
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  elementSpans,
  findProtectedSpans,
  isFiller,
  maskSource,
  matchBracket,
  previousSignificant,
  trimSpan,
} from './source-shape.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INSTALL_DIR = path.join(ROOT, 'src', 'surface', 'install');

const MAX_PASSES = 200;

/** 数组元素允许的形态：标识符路径、字符串、数字。 */
const SIMPLE_ELEMENT = /^\s*(?:[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*|"[^"]*"|'[^']*'|\d+(?:\.\d+)?)\s*$/;
/** R4 允许再剥一层的形态：在 SIMPLE_ELEMENT 基础上允许常量下标。 */
const SIMPLE_GROUP = /^\s*(?:[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\[\s*(?:"[^"]*"|'[^']*'|\d+|[A-Za-z_$][\w$]*)\s*\])*|"[^"]*"|'[^']*'|\d+(?:\.\d+)?)\s*$/;
/** 去掉小括号前允许出现的关键字——它们是语句/表达式前缀，不是被调用的标识符。 */
const PREFIX_KEYWORDS = new Set([
  'delete', 'typeof', 'void', 'return', 'case', 'in', 'of', 'new', 'await', 'yield', 'do', 'else',
]);
/** 块内出现这些关键字就不去花括号（保守：宁可留括号，不可改作用域）。 */
const LEXICAL_DECLARATION = /\b(?:let|const|class|function)\b/;

/** 读出以 `end` 结尾的那个标识符。 */
function trailingWord(masked, end) {
  let start = end;
  while (start >= 0 && /[\w$]/.test(masked[start])) start -= 1;
  return masked.slice(start + 1, end + 1);
}

/** 元素是否是「可安全内联展开」的形态：简单表达式，或一层套一层的简单数组。 */
function isSimpleElement(masked, from, to, depth = 0) {
  const [start, end] = trimSpan(masked, from, to);
  if (start >= end) return false;
  if (SIMPLE_ELEMENT.test(masked.slice(start, end))) return true;
  if (depth >= 2 || masked[start] !== '[') return false;
  const close = matchBracket(masked, start, '[', ']');
  if (close !== end - 1) return false;
  return elementSpans(masked, start, close)
    .every(([partFrom, partTo]) => isSimpleElement(masked, partFrom, partTo, depth + 1));
}

/**
 * 在整份文件上找出**全部互不重叠**的命中并一次替换掉。
 *
 * 每处命中都重扫整份文件是 O(n²)，在 240KB 的 install-webgl.js 上要跑几分钟；
 * 这里一次扫描收集全部区间（命中之间用 `cursor` 跳过，天然不重叠），再一次性拼接。
 * 所有 `find` 都在同一份原文上算偏移，因此可以放心批量替换。
 */
function applyAll(source, find) {
  const masked = maskSource(source);
  const regions = [];
  let cursor = 0;
  while (cursor < masked.length) {
    const region = find(masked, source, cursor);
    if (region === null) break;
    regions.push(region);
    cursor = Math.max(region.to, region.from + 1);
  }
  if (regions.length === 0) return null;

  let out = '';
  let last = 0;
  for (const region of regions) {
    out += source.slice(last, region.from) + region.replacement;
    last = region.to;
  }
  out += source.slice(last);
  return { source: out, count: regions.length };
}

/** R1：`([A, B, C])[1]` → `B`。 */
function findIndexedLiteral(masked, source, from) {
  for (let start = from; start < masked.length; start += 1) {
    if (masked[start] !== '[') continue;
    const end = matchBracket(masked, start, '[', ']');
    if (end === -1) continue;

    const parenStart = previousSignificant(masked, start);
    if (parenStart === -1 || masked[parenStart] !== '(') continue;
    // 用括号配对找分组括号的闭合，而不是正则里数右括号——外层可能还套着好几层。
    const closeParen = matchBracket(masked, parenStart, '(', ')');
    if (closeParen === -1) continue;
    const indexMatch = /^\s*\[\s*(\d+)\s*\]/.exec(masked.slice(closeParen + 1));
    if (indexMatch === null) continue;

    const elements = elementSpans(masked, start, end);
    if (elements.length < 2) continue;
    if (!elements.every(([elementFrom, elementTo]) => isSimpleElement(masked, elementFrom, elementTo))) continue;

    const picked = elements[Number(indexMatch[1])];
    if (picked === undefined) continue;

    const [pickedStart, pickedEnd] = trimSpan(masked, picked[0], picked[1]);
    return {
      from: parenStart,
      to: closeParen + 1 + indexMatch[0].length,
      replacement: source.slice(pickedStart, pickedEnd),
    };
  }
  return null;
}

/** R2：`do { X } while (false);` → `X`（块内有词法声明时保留花括号）。 */
function findIdleLoop(masked, source, from) {
  for (let doIndex = masked.indexOf('do', from); doIndex !== -1; doIndex = masked.indexOf('do', doIndex + 1)) {
    if (/\w/.test(masked[doIndex - 1] ?? '') || /\w/.test(masked[doIndex + 2] ?? '')) continue;
    const prev = previousSignificant(masked, doIndex);
    if (prev !== -1 && !['{', '}', ';'].includes(masked[prev])) continue;
    let cursor = doIndex + 2;
    while (cursor < masked.length && isFiller(masked[cursor])) cursor += 1;
    if (masked[cursor] !== '{') continue;
    const blockEnd = matchBracket(masked, cursor, '{', '}');
    if (blockEnd === -1) continue;
    const tail = /^\s*while\s*\(\s*false\s*\)\s*;?/.exec(masked.slice(blockEnd + 1));
    if (tail === null) continue;

    const body = source.slice(cursor + 1, blockEnd);
    const replacement = LEXICAL_DECLARATION.test(masked.slice(cursor + 1, blockEnd)) ? `{${body}}` : body;
    return { from: doIndex, to: blockEnd + 1 + tail[0].length, replacement };
  }
  return null;
}

/** R3：`{ { X } }` → `{ X }`（外层块只有这一个子块时）。 */
function findSoleChildBlock(masked, source, from) {
  for (let start = from; start < masked.length; start += 1) {
    if (masked[start] !== '{') continue;
    const outerEnd = matchBracket(masked, start, '{', '}');
    if (outerEnd === -1) continue;

    let cursor = start + 1;
    while (cursor < outerEnd && isFiller(masked[cursor])) cursor += 1;
    if (masked[cursor] !== '{') continue;
    const innerEnd = matchBracket(masked, cursor, '{', '}');
    if (innerEnd === -1 || innerEnd > outerEnd) continue;
    if (masked.slice(innerEnd + 1, outerEnd).trim() !== '') continue;

    return {
      from: start,
      to: outerEnd + 1,
      replacement: '{' + source.slice(cursor + 1, innerEnd) + '}',
    };
  }
  return null;
}

/** R4：行中间 `(简单表达式)` → 去掉小括号。 */
function findRedundantParens(masked, source, from) {
  for (let start = from; start < masked.length; start += 1) {
    if (masked[start] !== '(') continue;
    const prev = previousSignificant(masked, start);
    if (prev === -1) continue;

    const prevChar = masked[prev];
    // `)`/`]`/`.`/引号结尾 → 调用或成员访问，括号不能去。
    if (/[)\]"'`.]/.test(prevChar)) continue;
    // 标识符结尾 → 只有 delete/typeof/return 这类前缀关键字才允许去括号。
    if (/[\w$]/.test(prevChar) && !PREFIX_KEYWORDS.has(trailingWord(masked, prev))) continue;

    // 行首小括号可能承接上一行的表达式（ASI），不动。
    const lineStart = source.lastIndexOf('\n', start) + 1;
    if (source.slice(lineStart, start).trim() === '') continue;

    const end = matchBracket(masked, start, '(', ')');
    if (end === -1) continue;
    if (!SIMPLE_GROUP.test(masked.slice(start + 1, end))) continue;

    const inner = source.slice(start + 1, end).trim();
    if (inner === '') continue;
    return { from: start, to: end + 1, replacement: inner };
  }
  return null;
}

const REWRITES = [
  ['R1', findIndexedLiteral],
  ['R2', findIdleLoop],
  ['R3', findSoleChildBlock],
  ['R4', findRedundantParens],
];

/**
 * 收尾清理：去掉变换留下的行尾空白与连续空行。
 *
 * 只有确认「没有任何字符串/模板跨行」时才执行——注释跨行无所谓（改注释内容不影响
 * 语义），但删模板字面量里的空行会改字符串内容。受保护位置的行尾空白一律不碰。
 */
function cleanup(source) {
  const hasMultilineString = findProtectedSpans(source).some(
    (span) => span.kind === 'string' && source.slice(span.from, span.to).includes('\n'),
  );
  if (hasMultilineString) {
    return source;
  }

  const masked = maskSource(source);
  const out = [];
  let offset = 0;
  let blankRun = 0;
  for (const line of source.split('\n')) {
    let end = line.length;
    while (end > 0
      && (line[end - 1] === ' ' || line[end - 1] === '\t')
      && source[offset + end - 1] === masked[offset + end - 1]) {
      end -= 1;
    }
    offset += line.length + 1;
    const kept = line.slice(0, end);
    if (kept === '') {
      blankRun += 1;
      if (blankRun > 1) continue;
    } else {
      blankRun = 0;
    }
    out.push(kept);
  }
  return out.join('\n');
}

function transform(source) {
  let current = source;
  const counts = { R1: 0, R2: 0, R3: 0, R4: 0 };
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    let next = null;
    for (const [kind, find] of REWRITES) {
      next = applyAll(current, find);
      if (next !== null) {
        counts[kind] += next.count;
        break;
      }
    }
    if (next === null) {
      const cleaned = cleanup(current);
      return { source: cleaned, counts, changed: cleaned !== source };
    }
    current = next.source;
  }
  throw new Error(`变换未收敛（超过 ${MAX_PASSES} 轮），中止`);
}

const SELF_TEST_CASES = [
  ['const x = (([a, b, c])[1]);', 'const x = b;'],
  ['const x = (([a, b, c,])[2]);', 'const x = c;'],
  ['do {\n  f(1);\n} while (false);\n', '\n  f(1);\n'],
  ['do {\n  do {\n    f(1);\n  } while (false);\n} while (false);\n', '\n    f(1);\n'],
  ['do {\n  let x = 1;\n} while (false);\n', '{\n  let x = 1;\n}\n'],
  ['delete (Crypto).prototype.constructor;\n', 'delete Crypto.prototype.constructor;\n'],
  ['f((a, b));\n', 'f((a, b));\n'],
  ['f(1)(2);\n', 'f(1)(2);\n'],
  ['[state.a, state.b] = [start, end];\n', '[state.a, state.b] = [start, end];\n'],
  ['const s = "  keep  "; f(1);\n', 'const s = "  keep  "; f(1);\n'],
];

function selfTest() {
  for (const [input, expected] of SELF_TEST_CASES) {
    const actual = transform(input).source;
    if (actual !== expected) {
      throw new Error(
        `自检失败\n  输入: ${JSON.stringify(input)}\n  期望: ${JSON.stringify(expected)}\n  实际: ${JSON.stringify(actual)}`,
      );
    }
  }
  console.log(`自检通过（${SELF_TEST_CASES.length} 例）`);
}

async function listInstallFiles() {
  const entries = await readdir(INSTALL_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => path.join(INSTALL_DIR, entry.name));
}

async function main() {
  if (process.argv.includes('--self-test')) {
    selfTest();
    return;
  }

  const write = process.argv.includes('--write');
  const files = await listInstallFiles();
  const changed = [];
  const totals = { R1: 0, R2: 0, R3: 0, R4: 0 };
  let savedBytes = 0;

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const result = transform(source);
    if (!result.changed) continue;
    for (const kind of Object.keys(totals)) totals[kind] += result.counts[kind];
    changed.push({ file, counts: result.counts, delta: source.length - result.source.length });
    savedBytes += source.length - result.source.length;
    if (write) await writeFile(file, result.source);
  }

  changed.sort((a, b) => b.delta - a.delta);
  for (const entry of changed.slice(0, 15)) {
    console.log(
      `  ${String(entry.delta).padStart(6)}B  ${['R1', 'R2', 'R3', 'R4'].map((k) => `${k}:${entry.counts[k]}`).join(' ')}`
      + `  ${path.relative(ROOT, entry.file)}`,
    );
  }

  console.log(
    `${write ? '已改写' : '待改写'} ${changed.length}/${files.length} 个文件`
    + `  R1:${totals.R1} R2:${totals.R2} R3:${totals.R3} R4:${totals.R4}`
    + `  共减少 ${savedBytes} 字节`,
  );
  if (!write) console.log('（dry-run，加 --write 落盘）');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
