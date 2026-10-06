/**
 * 源码形态分析工具：给 `check-code-shape.mjs`（CI 护栏）和一次性迁移脚本共用。
 *
 * 只用 Node 标准库，不引依赖。所有函数都假设调用方给的是**同一份文本**——函数
 * 返回的偏移量可以直接拿去切片。
 */

/**
 * 扫描出所有字符串/模板/注释区间。
 *
 * `kind` 区分是否需要保留定界符：字符串保留引号（方便按 `"..."` 形态识别），
 * 注释整体可挖空。
 */
export function findProtectedSpans(text) {
  const spans = [];
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    if (char === '/' && text[index + 1] === '/') {
      let end = index;
      while (end < text.length && text[end] !== '\n') end += 1;
      spans.push({ from: index, to: end, kind: 'comment' });
      index = end;
      continue;
    }
    if (char === '/' && text[index + 1] === '*') {
      let end = index + 2;
      while (end < text.length && !(text[end] === '*' && text[end + 1] === '/')) end += 1;
      end = Math.min(text.length, end + 2);
      spans.push({ from: index, to: end, kind: 'comment' });
      index = end;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      let end = index + 1;
      while (end < text.length) {
        if (text[end] === '\\') {
          end += 2;
          continue;
        }
        if (text[end] === char) {
          end += 1;
          break;
        }
        end += 1;
      }
      spans.push({ from: index, to: end, kind: 'string' });
      index = end;
      continue;
    }
    index += 1;
  }
  return spans;
}

/**
 * 把字符串内容与注释替换成等长的哨兵字符（NUL），保留引号本身与所有偏移量。
 *
 * 用哨兵而不是空格，是为了让调用方能分辨「这段空白在字符串里」还是「这段空白是代码」：
 * `masked[i] !== source[i]` 即为受保护位置。模板字面量整段挖空（含 `${}` 内部），
 * 属于有意的保守处理——宁可少改，不可改错。
 */
export function maskSource(text) {
  const chars = text.split('');
  const blank = (from, to) => {
    for (let index = from; index < to; index += 1) {
      if (chars[index] !== '\n' && chars[index] !== '\r') chars[index] = '\u0000';
    }
  };
  for (const span of findProtectedSpans(text)) {
    if (span.kind === 'string') blank(span.from + 1, Math.max(span.from + 1, span.to - 1));
    else blank(span.from, span.to);
  }
  return chars.join('');
}

/** 从 `openIndex` 处的开括号找到配对的闭括号下标，找不到返回 -1。 */
export function matchBracket(masked, openIndex, open = '{', close = '}') {
  let depth = 0;
  for (let index = openIndex; index < masked.length; index += 1) {
    const char = masked[index];
    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

/**
 * 挖空后的文本里哪些字符对结构判定「等于不存在」：空白，以及哨兵本身。
 *
 * 注释被挖成哨兵，如果不把它算作填充，`previousSignificant` 会停在注释上，
 * 于是「注释写在 `do {` 前面的空转循环」这类形态就漏检了。
 */
export function isFiller(char) {
  return char === undefined || /\s/.test(char) || char === '\u0000';
}

/** 返回 `start` 之前最近的、非填充字符下标，找不到返回 -1。 */
export function previousSignificant(masked, start) {
  for (let index = start - 1; index >= 0; index -= 1) {
    if (!isFiller(masked[index])) return index;
  }
  return -1;
}

/** 去掉区间两端的空白，返回新的 [start, end)。 */
export function trimSpan(masked, from, to) {
  let start = from;
  let end = to;
  while (start < end && isFiller(masked[start])) start += 1;
  while (end > start && isFiller(masked[end - 1])) end -= 1;
  return [start, end];
}

/** 把 `from..to` 按顶层逗号切成若干段，返回每段的 [start, end) 偏移。 */
export function topLevelSpans(masked, from, to) {
  const spans = [];
  let depth = 0;
  let partStart = from;
  for (let index = from; index < to; index += 1) {
    const char = masked[index];
    if (char === '[' || char === '(' || char === '{') depth += 1;
    else if (char === ']' || char === ')' || char === '}') depth -= 1;
    else if (char === ',' && depth === 0) {
      spans.push([partStart, index]);
      partStart = index + 1;
    }
  }
  spans.push([partStart, to]);
  return spans;
}

/**
 * 数组字面量的元素区间。
 *
 * 与 `topLevelSpans` 的差别是丢掉尾逗号产生的空元素：生成的表格几乎都写成
 * `[A, B, C,]`，不处理的话最后一个元素永远是空白，元素计数和下标都会错位。
 */
export function elementSpans(masked, arrayOpen, arrayClose) {
  const spans = topLevelSpans(masked, arrayOpen + 1, arrayClose);
  while (spans.length > 0) {
    const last = spans[spans.length - 1];
    const [start, end] = trimSpan(masked, last[0], last[1]);
    if (start < end) break;
    spans.pop();
  }
  return spans;
}

/** 统计挖空后文本里 `do { … } while (false)` 的出现次数。 */
export function countIdleLoops(masked) {
  return (masked.match(/while\s*\(\s*false\s*\)/g) || []).length;
}

/**
 * 找出「内联数组字面量 + 常量下标」的位置，如 `([A, B, C])[1]`。
 *
 * 这是循环被机械摊平的残留特征。要求字面量被括号包住、紧跟 `)[数字]`，
 * 且元素数 ≥3——声明式的成员表（`[["method", "close", 0], …]`）不会被命中。
 */
export function findIndexedLiterals(masked) {
  const found = [];
  for (let start = 0; start < masked.length; start += 1) {
    if (masked[start] !== '[') continue;
    const end = matchBracket(masked, start, '[', ']');
    if (end === -1) continue;

    const parenStart = previousSignificant(masked, start);
    if (parenStart === -1 || masked[parenStart] !== '(') continue;
    const closeParen = matchBracket(masked, parenStart, '(', ')');
    if (closeParen === -1) continue;
    if (!/^\s*\[\s*\d+\s*\]/.test(masked.slice(closeParen + 1))) continue;

    const elements = elementSpans(masked, start, end);
    if (elements.length < 3) continue;
    found.push({ index: start, length: end - start + 1, elementCount: elements.length });
  }
  return found;
}
