import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const BOOTSTRAPS = Object.freeze({
  root: new URL('../../engine/bootstrap/bootstrap-root.js', import.meta.url),
  worker: new URL('../../engine/bootstrap/bootstrap-worker.js', import.meta.url),
  worklet: new URL('../../engine/bootstrap/bootstrap-worklet.js', import.meta.url),
});

const CALL_PATTERN = /^\s*(?:if\s*\([^\n]*\)\s*)?([A-Za-z_$][\w$]*)\s*\(/u;
const INCLUDED_CALLS = /^(?:hide|configure|install|finalize|definitions\.)/u;

export async function captureBootstrapOrderSnapshot() {
  const entries = {};
  for (const [name, url] of Object.entries(BOOTSTRAPS)) {
    entries[name] = await captureBootstrapEntry(name, url);
  }
  return {
    schema: 'nv8.baseline.bootstrap-order/v1',
    entries,
  };
}

async function captureBootstrapEntry(name, url) {
  const source = await readFile(url, 'utf8');
  const functionInfo = findBootstrapFunction(source, name);
  const body = source.slice(functionInfo.bodyStart + 1, functionInfo.bodyEnd);
  const bodyLines = source.slice(0, functionInfo.bodyStart + 1).split('\n').length;
  const calls = [];
  for (const [index, line] of body.split('\n').entries()) {
    const match = CALL_PATTERN.exec(line);
    if (match === null || !INCLUDED_CALLS.test(match[1])) continue;
    calls.push({
      name: match[1],
      line: bodyLines + index,
      kind: callKind(match[1]),
    });
  }
  const callSequence = calls.map(call => `${call.kind}:${call.name}`).join('\n');
  return {
    file: url.pathname.split('/').slice(-2).join('/'),
    sourceSha256: createHash('sha256').update(source).digest('hex'),
    function: functionInfo.name,
    functionStartLine: functionInfo.startLine,
    functionEndLine: functionInfo.endLine,
    callCount: calls.length,
    callSequenceSha256: createHash('sha256').update(callSequence).digest('hex'),
    firstCall: calls[0]?.name ?? null,
    lastCall: calls.at(-1)?.name ?? null,
    // 完整序列。存进 fixture 后，序列变化可以定位到具体调用，
    // 而不是只看到一个变了的 sha256。
    sequence: Object.freeze(calls.map(call => `${call.kind}:${call.name}`)),
    calls,
  };
}

/**
 * 对比两份安装序列，返回可定位的差异。
 *
 * 区分三类，因为它们的严重程度不同：
 * - `removed`：安装步骤消失，最可疑
 * - `added`：新增安装步骤，通常是有意为之但需确认
 * - `reordered`：集合相同但顺序变了，最容易被忽略的回归
 *
 * @param {readonly string[]} expected
 * @param {readonly string[]} actual
 * @returns {{ removed: string[], added: string[], reordered: object[] }}
 */
export function diffBootstrapSequence(expected, actual) {
  const expectedCounts = countBy(expected);
  const actualCounts = countBy(actual);

  const removed = [];
  const added = [];

  for (const [entry, count] of expectedCounts) {
    const delta = count - (actualCounts.get(entry) ?? 0);
    for (let index = 0; index < delta; index += 1) removed.push(entry);
  }
  for (const [entry, count] of actualCounts) {
    const delta = count - (expectedCounts.get(entry) ?? 0);
    for (let index = 0; index < delta; index += 1) added.push(entry);
  }

  // 集合一致时才比顺序；否则位置偏移会淹没真正的信号
  const reordered = [];
  if (removed.length === 0 && added.length === 0) {
    for (let index = 0; index < expected.length; index += 1) {
      if (expected[index] !== actual[index]) {
        reordered.push({ index, expected: expected[index], actual: actual[index] });
      }
    }
  }

  return { removed: removed.sort(), added: added.sort(), reordered };
}

function countBy(entries) {
  const counts = new Map();
  for (const entry of entries) counts.set(entry, (counts.get(entry) ?? 0) + 1);
  return counts;
}

function callKind(name) {
  if (name.startsWith('install')) return 'install';
  if (name.startsWith('configure')) return 'configure';
  if (name.startsWith('finalize')) return 'finalize';
  if (name.startsWith('hide')) return 'bootstrap';
  return 'internal';
}

function findBootstrapFunction(source, type) {
  const expression = new RegExp(`export\\s+function\\s+(bootstrap${capitalize(type)})\\s*\\(`, 'u');
  const match = expression.exec(source);
  if (match === null) throw new Error(`Bootstrap function not found: ${type}`);
  const openBrace = source.indexOf('{', match.index + match[0].length);
  if (openBrace < 0) throw new Error(`Bootstrap body not found: ${type}`);
  const closeBrace = findMatchingBrace(source, openBrace);
  return {
    name: match[1],
    bodyStart: openBrace,
    bodyEnd: closeBrace,
    startLine: source.slice(0, match.index).split('\n').length,
    endLine: source.slice(0, closeBrace + 1).split('\n').length,
  };
}

function findMatchingBrace(source, openBrace) {
  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  for (let index = openBrace; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (character === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote !== null) {
      if (character === '\\') {
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }
    if (character === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (character === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }
    if (character === '{') depth += 1;
    if (character === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error('Unterminated bootstrap function body');
}

function capitalize(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
