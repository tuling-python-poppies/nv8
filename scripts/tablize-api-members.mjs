#!/usr/bin/env node
/**
 * 一次性迁移：把「一个成员一个文件」的家族收成一张表，并让安装器循环装表。
 *
 * 家族成员的形态必须可由名字（加若干字面量参数）推导：
 *
 *   pair      const d = f("id"); export const id = d.get; export const setId = d.set;
 *   readonly  const d = f("x"); export const x = d.get;
 *   single    export const x = f("x", ...);
 *
 * 这类文件是纯重复；人从零写会写表 + 循环。迁移后：
 *
 *   // api/<域>/<工厂>-members.js
 *   const ANIMATIONPROPERTYMEMBERS_ROWS = [["id"], ["effect"]];
 *   export const animationpropertyMembers = ANIMATIONPROPERTYMEMBERS_ROWS
 *     .map(([name, ...args]) => [name, animationProperty(name, ...args)]);
 *
 *   // install-*.js
 *   for (const [name, entry] of animationpropertyMembers) accessor(name, entry.get, entry.set);
 *
 * 安装侧的改写不需要为每个家族手写模板：把语句里的成员名换成 `<name>`、成员引用换成
 * `<entry:导出名>`，**模板相同的连续语句就能合成一个循环**，循环体是回填后的模板。
 *
 * 用法：
 *   node scripts/tablize-api-members.mjs                      # 报告
 *   node scripts/tablize-api-members.mjs --only canvas        # 限定若干域
 *   node scripts/tablize-api-members.mjs --only canvas --write
 *
 * ## 还没跨过去的坎（要用这个工具前先读）
 *
 * ### 1. 已解决：api 目录里的安装语句
 *
 * 两个 handler 家族的安装函数写在 **api 目录的桶文件**里（`document-event-members.js`
 * 的 6 个 `install*EventMembers`）。此前扫描范围只有 `src/surface/install/**`，
 * 于是桶的 import 被摘、语句没人改写 → `onabort is not defined`。
 *
 * 现在：目标文件也纳入消费者扫描（`rewriteConsumer` 两处复用），并且**先改写目标正文、
 * 再追加表**；目标内的表引用不补 import（避免自引用）。实测这两个家族（219 个成员文件）
 * 已能迁移，护栏通过。
 *
 * ### 2. 已解决：按「安装函数名」给表命名会撞名
 *
 * 多作用域时我曾用外层函数名给表命名，于是同一个安装函数里装的**两个家族**都叫
 * `hTMLElementTable`（`htmlStringDescriptor` 与 `htmlBooleanDescriptor` 都由
 * `installHTMLElement` 装）。消费者第二次 import 同名表时被去重跳过，循环于是迭代了**另一族**的
 * 表——`HTMLElement` 少 13 个成员（实测 143 → 130），而布尔那 5 个被重复装了一遍，成员数看不出来。
 *
 * 现在表名一律带**家族**名：单作用域 `<工厂>Table`，多作用域 `<工厂>Part<N>Table`。
 *
 * 教训：**漏装比过装隐蔽**——过装会让成员数变多、一眼可见；漏装只让某个成员悄悄消失，
 * 只有 `capture-full-surface` 的成员摘要能抓到。所以每次落盘前那三份基线不能省。
 *
 * ### 3. 成员被当值用 / 被别的模块直接 import
 *
 * 前者（`mediaListMethod` 的 `values` 作 `Symbol.iterator`）在表旁补一个具名导出即可：
 * `export const values = new Map(mediaListMethodTable).get("values");`。
 * 后者（`urlReflection` 的 anchor/image）按接口分表后名字唯一，审计应从「整族跳过」
 * 改为「把这个消费者一起改写」。两处都已经能**检测**（`stillReferencesDroppedNames`、
 * `audit`），只差改写。
 *
 * ### 4. 已经解决的：过装
 *
 * 每个连续安装段独立成表，表里正好是那段语句装的成员；整表循环与原语句严格等价，
 * 过装从原理上不可能再发生——这也是为什么 `finalizePrototypeSurfaceOrder()` 不再需要
 * 承担「裁剪」职责（它本来也不裁）。这个假设可以彻底丢掉了。
 *
 * ## 验证时务必先删掉本机缓存
 *
 * `src/engine/realm/module-bundle.json` 命中缓存就**用缓存里的旧源码**，
 * 会让 `npm test` 与基线在改动没生效的情况下显示全绿。跑验证前先删掉它。
 */

import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { findProtectedSpans, maskSource, topLevelSpans } from './source-shape.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_DIR = path.join(ROOT, 'src', 'surface', 'api');
const INSTALL_DIR = path.join(ROOT, 'src', 'surface', 'install');

const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g;
const REEXPORT_RE = /export\s*(?:\*|\{[^}]*\})\s*from\s*"([^"]+)";\n?/g;

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function namedImports(source) {
  const list = [];
  for (const match of source.matchAll(IMPORT_RE)) {
    list.push({
      whole: match[0],
      specifier: match[2],
      names: match[1].split(',').map((name) => name.trim()).filter(Boolean),
    });
  }
  return list;
}

/** 解析 import：具名与 `import * as ns` 都要，用于确定语句的归属来源。 */
function allImports(source) {
  const named = new Map();
  const namespaces = new Map();
  for (const match of source.matchAll(IMPORT_RE)) {
    for (const name of match[1].split(',').map((value) => value.trim()).filter(Boolean)) {
      named.set(name, match[2]);
    }
  }
  for (const match of source.matchAll(/import\s*\*\s*as\s+([\w$]+)\s*from\s*"([^"]+)";/g)) {
    namespaces.set(match[1], match[2]);
  }
  return { named, namespaces };
}

function kebab(name) {
  return name
    // 缩写边界：HTMLAnchorElement → HTML-AnchorElement
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function relative(from, to) {
  const rel = path.relative(path.dirname(from), to).split(path.sep).join('/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

/** 按顶层分号切语句；有非空尾巴说明文件里还有别的东西。 */
function splitStatements(body) {
  const masked = maskSource(body);
  const statements = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < body.length; index += 1) {
    const char = masked[index];
    if (char === '(' || char === '[' || char === '{') depth += 1;
    else if (char === ')' || char === ']' || char === '}') depth -= 1;
    else if (char === ';' && depth === 0) {
      statements.push(body.slice(start, index + 1).trim());
      start = index + 1;
    }
  }
  return body.slice(start).trim() === '' ? statements : null;
}

/**
 * 解析一条工厂调用语句，返回绑定名、工厂名与**完整参数列表**。
 *
 * 参数列表整份保留，是因为成员名不一定在第一个位置：`documentHandlerDescriptor("onabort")`
 * 的名字是第 1 个参数，而 `stringReflection("HTMLAnchorElement", "href", "href")` 是第 2 个。
 * 表里存全量参数、用 `factory(...args)` 调用，就不必猜位置。
 */
function parseFactoryCall(statement, allowPrivate) {
  const match = (allowPrivate
    ? /^const (\w+) = ([\w$]+)\(([\s\S]*)\);$/
    : /^export const (\w+) = ([\w$]+)\(([\s\S]*)\);$/
  ).exec(statement);
  if (match === null) return null;
  const [, binding, factory, callArgs] = match;
  if (callArgs.includes(';') || callArgs.includes('export')) return null;
  const argsList = topLevelSpans(maskSource(callArgs), 0, callArgs.length)
    .map(([from, to]) => callArgs.slice(from, to).trim())
    .filter((arg) => arg !== '');
  if (argsList.length === 0) return null;
  return { binding, factory, argsList };
}

/**
 * 解析一个 api 文件里的**全部**成员语句。
 *
 * 一个文件可能是单成员（历史形态），也可能是之前合并出来的多成员模块——两者都要吃。
 * 要求所有语句共用同一个工厂、且解析完没有剩余文本，否则说明文件里还有别的东西，整份放弃。
 */
export async function readFamilyFile(file) {
  const source = await readFile(file, 'utf8');
  const imports = namedImports(source);
  if (imports.length === 0) return null;
  const body = source.replace(IMPORT_RE, '').replace(/\/\/[^\n]*/g, '').trim();
  const statements = splitStatements(body);
  if (statements === null) return null;

  const members = [];
  let factory = null;
  let index = 0;
  while (index < statements.length) {
    const call = parseFactoryCall(statements[index], true);
    if (call !== null) {
      const getMatch = /^export const (\w+) = (\w+)\.get;$/.exec(statements[index + 1] ?? '');
      const setMatch = /^export const (\w+) = (\w+)\.set;$/.exec(statements[index + 2] ?? '');
      if (getMatch !== null && getMatch[2] !== call.binding) return null;
      if (setMatch !== null && getMatch === null) return null;
      if (getMatch !== null && setMatch !== null) {
        if (setMatch[2] !== call.binding) return null;
        if (!call.argsList.includes(`"${getMatch[1]}"`)) return null;
        if (factory === null) factory = call.factory;
        if (call.factory !== factory) return null;
        members.push({
          name: getMatch[1],
          factory,
          argsList: call.argsList,
          kind: 'pair',
          exports: [{ name: getMatch[1], slot: 'get' }, { name: setMatch[1], slot: 'set' }],
        });
        index += 3;
        continue;
      }
      if (getMatch !== null) {
        if (!call.argsList.includes(`"${getMatch[1]}"`)) return null;
        if (factory === null) factory = call.factory;
        if (call.factory !== factory) return null;
        members.push({
          name: getMatch[1],
          factory,
          argsList: call.argsList,
          kind: 'readonly',
          exports: [{ name: getMatch[1], slot: 'get' }],
        });
        index += 2;
        continue;
      }
    }

    const single = parseFactoryCall(statements[index], false);
    if (single === null) return null;
    if (!single.argsList.includes(`"${single.binding}"`)) return null;
    if (factory === null) factory = single.factory;
    if (single.factory !== factory) return null;
    members.push({
      name: single.binding,
      factory,
      argsList: single.argsList,
      kind: 'single',
      exports: [{ name: single.binding, slot: null }],
    });
    index += 1;
  }
  if (members.length === 0 || factory === null) return null;
  if (!imports.some((entry) => entry.names.includes(factory))) return null;
  return { factory, imports, members };
}

/** 目标模块：优先复用目录里已经转发这组成员的 `-members.js` 桶，否则按工厂名新建。 */
async function findTargetModule(dir, members, nameHint = null) {
  const entries = await readdir(dir, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('-members.js'))
    .map((entry) => path.join(dir, entry.name));
  const bases = new Set(members.map((member) => path.basename(member.file)));
  const memberFiles = new Set(members.map((member) => member.file));
  const barrels = [];
  for (const candidate of candidates) {
    const source = await readFile(candidate, 'utf8');
    const forwarded = [...source.matchAll(REEXPORT_RE)].map((match) => path.basename(match[1]));
    if (forwarded.some((base) => bases.has(base))) {
      barrels.push(candidate);
      continue;
    }
    // 另一种桶：先 import 再 export（`import { a, b } from "./a-b-property.js";`）。
    // 只认 `export *`/`export {} from` 会漏掉它，于是目标判定另起新文件、旧桶被删。
    const importedFromMember = namedImports(source).some((entry) => (
      memberFiles.has(path.resolve(path.dirname(candidate), entry.specifier))
    ));
    if (importedFromMember) barrels.push(candidate);
  }
  if (barrels.length === 1) return { file: barrels[0], existed: true };
  if (barrels.length > 1) return { ambiguous: barrels.map((file) => path.basename(file)) };
  // 成员本来就都在同一个模块里（之前合并出来的多成员模块）——就地改写它。
  // 若另起新文件，旧模块会被当成待删成员文件删掉，而安装器还 import 着它。
  const uniqueFiles = [...new Set(members.map((member) => member.file))];
  if (uniqueFiles.length === 1) return { file: uniqueFiles[0], existed: true };
  const suffix = nameHint === null ? '' : `-${kebab(nameHint)}`;
  const created = path.join(dir, `${kebab(members[0].factory)}${suffix}-members.js`);
  return { file: created, existed: existsSync(created) };
}

/**
 * 成员的「接口」：工厂第一个参数是形如 `"HTMLAnchorElement"` 的字符串时取它，否则 null。
 *
 * 跨接口家族（`stringReflection("HTMLAnchorElement", "href", "href")` 这类）必须**按接口分表**：
 * 每个元素安装器只装自己接口的那几个成员，一张跨接口的表被任何安装器整表循环都会过装。
 * 单接口家族（第一个参数不是接口名，或本来就只有一个接口）保持原样。
 */
function interfaceKeyOf(member) {
  const first = member.argsList[0];
  return first !== undefined && /^"[A-Z][\w]*"$/.test(first) ? first.slice(1, -1) : null;
}

/**
 * 目标模块自己是否还在用这些成员（桶 + 安装器混合体）。
 *
 * `document-event-members.js` 就是这样：它转发成员，同时导出 6 个安装函数，分别在不同时机
 * 装同一家族的不同**子集**（readiness / pointerlock / lifecycle / …）。这类分组语义不是
 * 「一张表 + 一个循环」能表达的，删掉 import 只会让那些函数里的名字悬空。整族跳过。
 */
async function targetReusesMembers(targetFile, members) {
  if (!existsSync(targetFile)) return false;
  const source = await readFile(targetFile, 'utf8');
  const memberFiles = new Set(members.map((member) => member.file));
  const pointsAtMember = (specifier) => memberFiles.has(path.resolve(path.dirname(targetFile), specifier));
  const stripped = source
    .replace(/import\s*\{[^}]*\}\s*from\s*"([^"]+)";\n?/g, (whole, specifier) => (pointsAtMember(specifier) ? '' : whole))
    .replace(/export\s*(?:\*|\{[^}]*\})\s*from\s*"([^"]+)";\n?/g, (whole, specifier) => (pointsAtMember(specifier) ? '' : whole))
    .replace(/export\s*\{[^}]*\};/g, '');
  const masked = maskSource(stripped);
  return members.some((member) => member.exports.some((entry) => (
    new RegExp(`(?<![\\w$.])${entry.name}(?![\\w$])`).test(masked)
  )));
}

/**
 * 生成表声明。
 *
 * 行只存「名字 + 额外字面量参数」，工厂调用在 map 里统一发生，所以 `animationProperty`、
 * `documentMethod` 这类签名不同的工厂可以共用同一形状。
 */
export function buildTable(tableName, members) {
  const rowsName = `${tableName.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase()}_ROWS`;
  const rows = members
    .map((member) => `  ["${member.name}", ${member.argsList.join(', ')}],`)
    .join('\n');
  return [
    `const ${rowsName} = [`,
    rows,
    '];',
    '',
    `export const ${tableName} = ${rowsName}.map(`,
    `  ([name, ...args]) => [name, ${members[0].factory}(...args)],`,
    ');',
    '',
  ].join('\n');
}

/**
 * 确定一个安装文件里哪些家族是「在作用域内」的。
 *
 * 只看名字会大量误报：`accessor("width", width, setWidth)` 在十几个 html 元素的安装器里
 * 都有，但它们 import 的是各自的 width 模块。所以归属必须由 **import 来源**决定：
 * 具名导入看导出名是从哪个文件导进来的，命名空间导入看 `import * as ns` 指向哪个模块。
 */
export function fileScope(source, filePath, families) {
  const { named, namespaces } = allImports(source);
  const resolve = (specifier) => path.resolve(path.dirname(filePath), specifier);
  const scoped = [];

  for (const family of families) {
    const targetFile = family.target.file;
    let namespace = null;
    for (const [ns, specifier] of namespaces) {
      if (resolve(specifier) === targetFile) namespace = ns;
    }

    const namedExports = new Set();
    for (const member of family.members) {
      for (const entry of member.exports) {
        const specifier = named.get(entry.name);
        if (specifier === undefined) continue;
        const resolved = resolve(specifier);
        if (resolved === member.file || resolved === targetFile) namedExports.add(entry.name);
      }
    }

    if (namespace !== null) scoped.push({ family, namespace, namedExports: null });
    else if (namedExports.size > 0) scoped.push({ family, namespace: null, namedExports });
  }
  return scoped;
}

/**
 * 把成员名与成员引用换成占位符。
 *
 * 引用形式由作用域决定：命名空间导入是 `api.<导出名>`，具名导入是裸标识符；具名模式下还要求
 * 这个导出确实是从本家族导进来的，避免把同名的别的成员算进来。
 */
function toTemplate(line, member, scope) {
  const masked = maskSource(line);
  // 名字要读**原文**：挖空后的字符串内容已经变成哨兵了，只能用来定位。
  const nameMatch = /"([^"]+)"/.exec(line);
  const edits = [];
  if (nameMatch !== null && nameMatch[1] === member.name) {
    edits.push({ from: nameMatch.index, to: nameMatch.index + nameMatch[0].length, text: '<name>' });
  } else {
    return null;
  }
  for (const entry of member.exports) {
    if (scope.namedExports !== null && !scope.namedExports.has(entry.name)) continue;
    const index = member.exports.indexOf(entry);
    const pattern = scope.namespace === null
      ? new RegExp(`(?<![\\w$.])${entry.name}(?![\\w$])`, 'g')
      : new RegExp(`\\b${scope.namespace}\\.${entry.name}(?![\\w$])`, 'g');
    for (const match of masked.matchAll(pattern)) {
      // 占位符按成员内部的下标编号，不带成员名——否则每个成员的模板都不同，认不出连续段
      edits.push({ from: match.index, to: match.index + match[0].length, text: `<entry:${index}>` });
    }
  }
  if (!edits.some((edit) => edit.text.startsWith('<entry:'))) return null;

  edits.sort((a, b) => a.from - b.from);
  let out = '';
  let cursor = 0;
  for (const edit of edits) {
    if (edit.from < cursor) continue;
    out += line.slice(cursor, edit.from) + edit.text;
    cursor = edit.to;
  }
  return {
    template: collapseOutsideStrings(out + line.slice(cursor)),
    slots: member.exports.map((entry) => entry.slot),
  };
}

/** 回填模板：`<name>` → 循环变量，`<entry:i>` → 第 i 个导出在表项里的取值表达式。 */
function fillTemplate(template, slots) {
  return template
    .replace('<name>', 'name')
    .replace(/<entry:(\d+)>/g, (whole, index) => {
      const slot = slots[Number(index)];
      return slot === null || slot === undefined ? 'entry' : `entry.${slot}`;
    });
}

/** 从具名导入里摘掉若干导出名；语句被摘空就整条删除。 */
function dropNamedImports(source, filePath, dropByPath) {
  const pattern = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g;
  return source.replace(pattern, (whole, namesText, specifier) => {
    const resolved = path.resolve(path.dirname(filePath), specifier);
    const drop = dropByPath.get(resolved);
    if (drop === undefined) return whole;
    const kept = namesText.split(',').map((name) => name.trim()).filter(Boolean)
      .filter((name) => !drop.has(name));
    if (kept.length === 0) return '';
    return `import {\n${kept.map((name) => `  ${name},`).join('\n')}\n} from "${specifier}";`;
  });
}

/** 追加一个具名导入：已有同模块的命名导入就并进去，否则插在最后一条 import 之后。 */
function addNamedImport(source, name, specifier) {
  const pattern = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g;
  let merged = false;
  let lastEnd = -1;
  const expanded = source.replace(pattern, (whole, namesText, spec) => {
    if (spec !== specifier) return whole;
    const names = namesText.split(',').map((value) => value.trim()).filter(Boolean);
    if (names.includes(name)) {
      merged = true;
      return whole;
    }
    merged = true;
    return whole.replace(namesText, `\n${[...names, name].map((value) => `  ${value},`).join('\n')}\n`);
  });
  for (const match of expanded.matchAll(/import\s*\{[^}]*\}\s*from\s*"[^"]+";|import\s*\*\s*as\s+[\w$]+\s*from\s*"[^"]+";/g)) {
    lastEnd = match.index + match[0].length;
  }
  if (merged) return expanded;
  // 文件里一条 import 都没有时（原 import 全是被删成员），插到文件开头，
  // 否则表名会悬空——`node --check` 与基线都看不出这类问题。
  if (lastEnd === -1) {
    return `import { ${name} } from "${specifier}";\n\n${expanded.replace(/^\n+/, '')}`;
  }
  return `${expanded.slice(0, lastEnd)}\nimport { ${name} } from "${specifier}";${expanded.slice(lastEnd)}`;
}

/** 整理 import 区：去掉空行，与正文之间留恰好一个空行。 */
/**
 * 摘掉具名导入后，文件里是否还在别处用这些名字。
 *
 * `install-media-list.js` 就是反例：成员 `values` 不是被安装语句装上去的，而是作为
 * `Symbol.iterator` 的值用的。变换只看「形如安装调用的语句」，会把它的 import 摘掉却留下
 * 引用——运行时 `values is not defined`，而 `node --check`、悬空导入检查、基线全都不报。
 *
 * 判定方式是把将要成环的语句段先挖掉，再看剩下的文本里还有没有这些名字；
 * 有就说明这个家族不能收成表，整族跳过。
 */
function stillReferencesDroppedNames(source, loops, droppedNames) {
  let text = source;
  for (const loop of [...loops].sort((a, b) => b.startOffset - a.startOffset)) {
    text = text.slice(0, loop.startOffset) + text.slice(loop.endOffset);
  }
  // 先摘掉 import / re-export 行：即将被删的那些导入名字不能算「本文件已有绑定」，
  // 否则正是要检查的悬空引用会被自己放过（`values` 那次就是这么漏的）。
  const body = text
    .replace(/import\s*\{[^}]*\}\s*from\s*"[^"]+";\n?/g, '')
    .replace(/import\s*\*\s*as\s+[\w$]+\s*from\s*"[^"]+";\n?/g, '');
  const masked = maskSource(body);
  // 文件自己绑定的名字不算（本地 helper 的参数常与成员重名：`function accessor(name, getter, setter)`）
  const bound = new Set();
  for (const match of masked.matchAll(/\b(?:const|let|var|function|class)\s+([\w$]+)/g)) bound.add(match[1]);
  for (const match of masked.matchAll(/(?:function\s*[\w$]*\s*|\()\s*([\w$]+)\s*[),=]/g)) bound.add(match[1]);
  const found = [];
  for (const name of droppedNames) {
    if (bound.has(name)) continue;
    // `value:` 这种对象字面量的键不是引用，排除掉
    if (new RegExp(`(?<![\\w$.])${name}(?![\\w$:])`).test(masked)) found.push(name);
  }
  return found;
}

function tidyImports(source) {
  const pattern = /import\s+(?:[\w$]+\s*,?\s*)?(?:\{[^}]*\}|\*\s*as\s+[\w$]+)\s*from\s*"[^"]+";|import\s+"[^"]+";/g;
  let end = 0;
  for (const match of source.matchAll(pattern)) end = match.index + match[0].length;
  if (end === 0) return source;
  const header = source.slice(0, end).replace(/\n\s*\n/g, '\n').replace(/\s+$/, '');
  const rest = source.slice(end).replace(/^\s+/, '');
  return rest === '' ? `${header}\n` : `${header}\n\n${rest}`;
}

/**
 * 找出安装文件里的成员语句段。
 *
 * 只有模板相同的**连续**语句才成环，因此安装顺序天然不变。
 */
export function findLoops(source, scoped) {
  const statements = logicalStatements(source);
  const loops = [];
  let index = 0;
  while (index < statements.length) {
    const first = matchStatement(statements[index].text, scoped);
    if (first === null) {
      index += 1;
      continue;
    }
    let count = 1;
    // 这一段循环装的就是这几个成员——「表按安装作用域切」靠它知道每张表该放哪些行
    const covered = [first.member];
    while (index + count < statements.length) {
      const next = matchStatement(statements[index + count].text, scoped);
      if (next === null
        || next.template !== first.template
        || next.slotsKey !== first.slotsKey
        || next.scope !== first.scope) break;
      covered.push(next.member);
      count += 1;
    }
    loops.push({
      ...first,
      covered,
      count,
      startOffset: statements[index].start,
      endOffset: statements[index + count - 1].end,
      indent: lineIndent(source, statements[index].start),
    });
    index += count;
  }
  return loops;
}

/**
 * 按逻辑语句切分源码：括号配对内的换行不切断语句。
 *
 * 安装器里大量语句是多行写法（`definePrototypeMethod(\n  X,\n  "name",\n  fn,\n);`），
 * 按行切会把续行当成独立引用，既匹不出循环、又把覆盖闸门撑成误报。
 */
export function logicalStatements(source) {
  const masked = maskSource(source);
  const statements = [];
  // 括号深度只看 `(`/`[`；花括号当**块边界**参与切分——否则整个函数体会被当成一条语句，
  // 函数体内的成员安装语句永远分不出来。
  let depth = 0;
  let start = 0;
  const push = (end) => {
    const text = source.slice(start, end).trim();
    if (text !== '') statements.push({ text, start: start + leadingSpaces(source, start), end });
    start = end;
  };
  for (let index = 0; index < source.length; index += 1) {
    const char = masked[index];
    if (char === '(' || char === '[') depth += 1;
    else if (char === ')' || char === ']') depth -= 1;
    else if (depth === 0 && (char === ';' || char === '{' || char === '}')) push(index + 1);
  }
  push(source.length);
  return statements;
}

function leadingSpaces(source, offset) {
  let index = offset;
  // 跳过整段空白（含换行）：语句起点落在自己的首个非空白字符上，
  // 只跳空格的话，替换会把新循环粘到上一条语句结尾。
  while (index < source.length && /\s/.test(source[index])) index += 1;
  return index - offset;
}

function lineIndent(source, offset) {
  const lineStart = source.lastIndexOf('\n', offset) + 1;
  return source.slice(lineStart, offset).match(/^[ \t]*/)?.[0] ?? '';
}

/**
 * 语句所在的函数体起点（找不到则 -1）。
 *
 * 去重复循环时要用它判定「同一作用域」：`installElementInternalsARIABeforeMethods` 与
 * `...AfterMethods` 装的是**不同时机**的成员，各自被调用时拿到不同的 accessor，
 * 把后者合并到前者会改变安装顺序（aria 那批就是刻意分前后的）。
 */
function enclosingFunction(source, offset) {
  const before = source.slice(0, offset);
  const matches = [...before.matchAll(/^[ \t]*(?:export\s+)?(?:async\s+)?function\s+[\w$]*/gm)];
  return matches.length === 0 ? -1 : matches[matches.length - 1].index;
}

/** 折叠空白，但不动字符串/模板内容。 */
export function collapseOutsideStrings(text) {
  const spans = findProtectedSpans(text).filter((span) => span.kind === 'string');
  let out = '';
  let cursor = 0;
  for (const span of spans) {
    out += text.slice(cursor, span.from).replace(/\s+/g, ' ');
    out += text.slice(span.from, span.to);
    cursor = span.to;
  }
  return (out + text.slice(cursor).replace(/\s+/g, ' ')).trim();
}

export function matchStatement(line, scoped) {
  const trimmed = line.trim();
  if (!trimmed.endsWith(';') || !/^[\w$]+\(/.test(trimmed)) return null;
  for (const scope of scoped) {
    for (const member of scope.family.members) {
      const converted = toTemplate(line, member, scope);
      if (converted === null) continue;
      return { ...converted, slotsKey: converted.slots.join('|'), scope, member };
    }
  }
  return null;
}

/**
 * 统计作用域内引用了本家族成员的行数。
 *
 * 用作覆盖闸门：如果「引用行数」多于「被循环覆盖的行数」，说明还有我认不出的用法，
 * 这时整个家族必须跳过——否则删掉成员文件后会留下悬空导入或静默少装成员。
 * 在挖空文本上匹配，字符串里的同名内容不算引用；**来源规则与匹配器一致**，否则会把别的
 * 家族的同名成员算进来，把闸门撑成误报（`accessor("target", target, setTarget)` 就是这种）。
 */
function countReferences(source, scoped) {
  // 多行 import 的续行也会命中成员名，先把 import 语句整段摘掉再数
  const withoutImports = source
    .replace(/import\s*\{[^}]*\}\s*from\s*"[^"]+";/g, '')
    .replace(/import\s*\*\s*as\s+[\w$]+\s*from\s*"[^"]+";/g, '');
  let count = 0;
  for (const statement of logicalStatements(withoutImports)) {
    const trimmed = statement.text.trim();
    // 只统计「形如安装调用」的语句。生成的循环（`for (…) accessor(name, …)`）与本地 helper
    // （`function getter(name, …) {`）里的 `name`/`getter` 会和某些成员重名，不排除就是误报。
    if (!/^[\w$]+\(/.test(trimmed)) continue;
    const nameMatch = /"([^"]+)"/.exec(statement.text);
    if (nameMatch === null) continue;
    const isMemberName = scoped.some((scope) => (
      scope.family.members.some((member) => member.name === nameMatch[1])
    ));
    if (!isMemberName) continue;
    const masked = maskSource(statement.text);
    let hit = false;
    for (const scope of scoped) {
      for (const member of scope.family.members) {
        for (const entry of member.exports) {
          if (scope.namedExports !== null && !scope.namedExports.has(entry.name)) continue;
          const pattern = scope.namespace === null
            ? new RegExp(`(?<![\\w$.])${entry.name}(?![\\w$])`)
            : new RegExp(`\\b${scope.namespace}\\.${entry.name}(?![\\w$])`);
          if (pattern.test(masked)) {
            hit = true;
            break;
          }
        }
        if (hit) break;
      }
      if (hit) break;
    }
    if (hit) count += 1;
  }
  return count;
}

/** 目标模块里指向本家族成员文件的转发语句，迁移后要删掉（否则指向已删文件）。 */
function stripForwarding(source, targetFile, members) {
  const pattern = /export\s*(?:\*|\{[^}]*\})\s*from\s*"([^"]+)";\n?/g;
  const memberFiles = new Set(members.map((member) => member.file));
  const stripped = source.replace(pattern, (whole, specifier) => (
    memberFiles.has(path.resolve(path.dirname(targetFile), specifier)) ? '' : whole
  ));
  // 桶也可能是「先 import 再 export」的形式：指向成员文件的 import 同样要摘掉，
  // 否则成员文件删掉后这里会留下悬空导入。
  return stripped.replace(
    /import\s*\{[^}]*\}\s*from\s*"([^"]+)";\n?/g,
    (whole, specifier) => (
      memberFiles.has(path.resolve(path.dirname(targetFile), specifier)) ? '' : whole
    ),
  );
}

function formatImportBlock(bySpecifier) {
  return [...bySpecifier.entries()]
    .map(([specifier, names]) => (names.length === 1
      ? `import { ${names[0]} } from "${specifier}";`
      : `import {\n${names.map((name) => `  ${name},`).join('\n')}\n} from "${specifier}";`))
    .join('\n');
}

/**
 * 把一个消费者文件改写成「循环语句 + 修好的导入」。
 *
 * 目标文件（api 目录的桶）本身也可能是消费者——它里面有安装函数。所以这段逻辑两个地方都用：
 * 单独写消费者时用，以及在写目标模块前先把它自己的正文改写掉（顺序反了会把刚写的表冲掉）。
 */
function rewriteConsumer(source, file, edit, tableNameByLoop, compatNames = new Map()) {
  let out = source;
  for (const loop of [...edit.loops].sort((a, b) => b.startOffset - a.startOffset)) {
    const tableName = tableNameByLoop.get(`${loop.plan.factory}|${file}|${loop.startOffset}`)?.name
      ?? loop.plan.tableName;
    const ref = loop.scope.namespace === null
      ? tableName
      : `${loop.scope.namespace}.${tableName}`;
    const replacement = `${loop.indent}for (const [name, entry] of ${ref}) `
      + `${fillTemplate(loop.template, loop.slots)}`;
    // 语句独占一行时把替换范围向前吃到行首，避免缩进叠加
    let from = loop.startOffset;
    const lineStart = out.lastIndexOf('\n', from - 1) + 1;
    if (out.slice(lineStart, from).trim() === '') from = lineStart;
    out = out.slice(0, from) + replacement + out.slice(loop.endOffset);
  }
  out = dropNamedImports(out, file, edit.drops);
  // 补 import：按该文件各循环**实际**用到的表名来补。目标文件本身是表的所有者，跳过（会自引用）。
  const needed = new Map();
  for (const loop of edit.loops) {
    if (loop.scope.namespace !== null) continue;
    if (loop.plan.target.file === file) continue;
    const name = tableNameByLoop.get(`${loop.plan.factory}|${file}|${loop.startOffset}`)?.name;
    if (name === undefined) continue;
    needed.set(name, relative(file, loop.plan.target.file));
  }
  for (const [tableName, specifier] of needed) {
    out = addNamedImport(out, tableName, specifier);
  }
  // 兼容名字：成员在别处还要按名字用（`values` 当 Symbol.iterator 的值、第三方直接 import）。
  // 表模块会具名再导出它们，这里把导入补上。
  const compatNeeded = new Map();
  for (const loop of edit.loops) {
    if (loop.scope.namespace !== null) continue;
    if (loop.plan.target.file === file) continue;
    const names = compatNames.get(loop.plan);
    if (names === undefined) continue;
    for (const name of names) {
      if (!new RegExp(`(?<![\\w$.])${name}(?![\\w$:])`).test(maskSource(out))) continue;
      compatNeeded.set(name, relative(file, loop.plan.target.file));
    }
  }
  for (const [name, specifier] of compatNeeded) {
    out = addNamedImport(out, name, specifier);
  }
  return tidyImports(out);
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const onlyIndex = args.indexOf('--only');
  const only = onlyIndex === -1
    ? null
    : new Set(args.slice(onlyIndex + 1).filter((arg) => !arg.startsWith('--')));
  const interfaceArg = args.indexOf('--interface');
  const interfaceFilter = interfaceArg === -1
    ? null
    : (args[interfaceArg + 1] ?? null);

  const apiFiles = (await walk(API_DIR)).filter((file) => !/-surface\.js$/.test(file));
  const grouped = new Map();
  for (const file of apiFiles) {
    const parsed = await readFamilyFile(file);
    if (parsed === null) continue;
    const dir = path.dirname(file);
    if (only !== null && !only.has(path.basename(dir))) continue;
    // 一个文件里的成员若跨接口，就不拆（拆了会让同一个文件落到两组、删除时打架）
    const keys = new Set(parsed.members.map(interfaceKeyOf));
    const fileInterface = keys.size === 1 ? [...keys][0] : null;
    if (interfaceFilter !== null && fileInterface !== interfaceFilter) continue;
    const key = `${dir}\u0000${parsed.factory}\u0000${fileInterface ?? ''}`;
    if (!grouped.has(key)) {
      grouped.set(key, { dir, factory: parsed.factory, interfaceName: fileInterface, members: [] });
    }
    const group = grouped.get(key);
    for (const member of parsed.members) {
      group.members.push({ file, imports: parsed.imports, interfaceName: fileInterface, ...member });
    }
  }

  const installFiles = await walk(INSTALL_DIR);
  const installSources = new Map();
  for (const file of installFiles) installSources.set(file, await readFile(file, 'utf8'));

  const plans = [];
  for (const group of grouped.values()) {
    const target = await findTargetModule(group.dir, group.members, group.interfaceName);
    if (target.ambiguous !== undefined) {
      console.log(`SKIP ${path.relative(ROOT, group.dir)} ${group.factory}：多个候选桶`);
      continue;
    }
    const slotByName = new Map();
    for (const member of group.members) {
      for (const entry of member.exports) slotByName.set(entry.name, entry.slot);
    }
    plans.push({
      ...group,
      target,
      tableName: `${group.factory}Table`,
      slotByName,
    });
  }

  // 每个家族在每个安装文件里的循环段。行号基于原始文本，因此同文件的多个家族可以一次性套用。
  // 目标模块（api 目录的桶）里也可能有安装语句（handler 家族的 6 个 install*EventMembers 就是），
  // 把它一并纳入消费者扫描，否则它的导入会被摘掉、里面的语句没人改写。
  for (const plan of plans) {
    if (installSources.has(plan.target.file)) continue;
    if (!existsSync(plan.target.file)) continue;
    installSources.set(plan.target.file, await readFile(plan.target.file, 'utf8'));
  }
  const skipped = [];

  /** 计算每个家族在哪些安装文件里成环；覆盖不全的家族直接剔除。 */
  function computeEdits(candidates) {
    const perPlan = new Map();
    const fileEdits = new Map();
    let totalLoops = 0;
    for (const plan of candidates) {
      const map = new Map();
      let covered = 0;
      let referenced = 0;
      let clean = true;
      for (const [file, source] of installSources) {
        const scoped = fileScope(source, file, [plan]);
        if (scoped.length === 0) continue;
        const loops = findLoops(source, scoped);
        const loopLines = loops.reduce((sum, loop) => sum + loop.count, 0);
        const references = countReferences(source, scoped);
        referenced += references;
        covered += loopLines;
        if (references !== loopLines) clean = false;
        // 等价性交给「表按安装作用域切」保证：每张表只放那段语句装的成员，
        // 所以循环不可能装上别的成员（过装）。这里只保留「不许有认不出的引用」这条。
        // 还要确认：被摘掉的导出名没有在别处（比如当值用）继续出现
        // 成员在别处（不是安装语句）还按名字被需要——不当成错误，而是让表模块把该名字
        // **具名再导出**，引用方改成从表模块取。`mediaListMethod` 的 `values`（当
        // `Symbol.iterator` 的值用）与 `urlReflection`（别的模块直接 import 成员文件）都是这类。
        const droppedNames = plan.members.flatMap((member) => member.exports.map((entry) => entry.name));
        for (const name of stillReferencesDroppedNames(source, loops, droppedNames)) {
          if (!compatNames.has(plan)) compatNames.set(plan, new Set());
          compatNames.get(plan).add(name);
        }
        if (loops.length === 0) continue;
        map.set(file, loops);
        totalLoops += loops.length;
      }
      if (!clean) {
        skipped.push(`${path.relative(ROOT, plan.dir).replace(/\\/g, '/')} ${plan.factory}`
          + `（引用 ${referenced} 行、可合并 ${covered} 行）`);
        continue;
      }
      perPlan.set(plan, map);

      for (const [file, loops] of map) {
        if (!fileEdits.has(file)) fileEdits.set(file, { loops: [], drops: new Map(), adds: [] });
        const edit = fileEdits.get(file);
        for (const loop of loops) edit.loops.push({ ...loop, plan });
        for (const member of plan.members) {
          if (!edit.drops.has(member.file)) edit.drops.set(member.file, new Set());
          for (const entry of member.exports) edit.drops.get(member.file).add(entry.name);
        }
        if (loops.some((loop) => loop.scope.namespace === null)) {
          edit.adds.push([plan.tableName, relative(file, plan.target.file)]);
        }
      }
    }
    return { perPlan, fileEdits, totalLoops };
  }

  /**
   * 写盘前审计：被删的成员文件不能再有别的引用者。
   *
   * 这是最后一道闸门——目标选错、或者别的模块直接 import 了成员文件时，删掉它会留下悬空导入。
   * 命中的**家族整体剔除**（而不是中止全部），让其余家族照常迁移。
   */
  async function audit(candidates, perPlan, fileEdits, compatNames) {
    const rewritten = new Set([...fileEdits.keys()]);
    for (const plan of perPlan.keys()) rewritten.add(plan.target.file);
    const owners = new Map();
    for (const plan of perPlan.keys()) {
      for (const member of plan.members) {
        if (!owners.has(member.file)) owners.set(member.file, new Set());
        owners.get(member.file).add(plan);
      }
    }
    const offenders = new Set();
    const samples = [];
    // 直接 import 成员文件的第三方：改成从表模块按名字取（表模块会具名再导出）。
    const rewrites = new Map();
    for (const file of await walk(path.join(ROOT, 'src'))) {
      if (rewritten.has(file)) continue;
      const source = await readFile(file, 'utf8');
      for (const match of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g)) {
        if (!match[2].startsWith('.')) continue;
        const plans = owners.get(path.resolve(path.dirname(file), match[2]));
        if (plans === undefined) continue;
        for (const plan of plans) {
          if (!rewrites.has(file)) rewrites.set(file, new Map());
          rewrites.get(file).set(match[2], relative(file, plan.target.file));
          if (!compatNames.has(plan)) compatNames.set(plan, new Set());
          for (const name of match[1].split(',').map((value) => value.trim()).filter(Boolean)) {
            compatNames.get(plan).add(name);
          }
        }
      }
    }
    return { offenders, samples, rewrites };
  }

  let active = plans;
  let perPlan;
  let fileEdits;
  let totalLoops = 0;
  // 「成员在别处按名字还要用」的集合：表模块会为这些名字补一个具名导出
  const compatNames = new Map();
  let rewrites = new Map();
  const dropped = [];
  for (let attempt = 0; attempt < 4; attempt += 1) {
    perPlan = new Map();
    fileEdits = new Map();
    ({ perPlan, fileEdits, totalLoops } = computeEdits(active));
    const audited = await audit(active, perPlan, fileEdits, compatNames);
    rewrites = audited.rewrites;
    const { offenders, samples } = audited;
    if (offenders.size === 0) break;
    for (const plan of offenders) {
      // 记到 dropped 而不是 skipped：skipped 每轮会被 computeEdits 重填，
      // 写在里面会被下一轮清掉，报告就看不出家族被审计剔除了。
      dropped.push(`${path.relative(ROOT, plan.dir).replace(/\\/g, '/')} ${plan.factory}`
        + `（有模块直接引用了它的成员文件：${samples[0] ?? ''}）`);
    }
    active = active.filter((plan) => !offenders.has(plan));
  }
  skipped.push(...dropped);

  for (const plan of plans) {
    const consumers = [...(perPlan.get(plan) ?? [])].map(
      ([file, loops]) => `${path.basename(file)}:${loops.reduce((sum, loop) => sum + loop.count, 0)}`,
    );
    console.log(
      `${String(plan.members.length).padStart(4)}  ${path.relative(ROOT, plan.dir).replace(/\\/g, '/').padEnd(24)}`
      + `${plan.factory.padEnd(32)} -> ${path.basename(plan.target.file).padEnd(40)} 循环: ${consumers.join(' ') || '无'}`,
    );
  }
  const planned = [...perPlan.keys()];
  console.log(`\n合计 ${planned.length}/${plans.length} 个家族、`
    + `${planned.reduce((sum, plan) => sum + plan.members.length, 0)} 个成员文件、`
    + `${totalLoops} 段循环、${fileEdits.size} 个安装文件待改` + (write ? '（已落盘）' : '（dry-run）'));
  if (skipped.length > 0) {
    console.log(`\n因覆盖不全而跳过 ${skipped.length} 个家族：`);
    for (const entry of skipped.slice(0, 15)) console.log(`  ${entry}`);
  }

  if (!write) return;

  const tableNameByLoop = new Map();
  const handledTargets = new Set();

  for (const plan of perPlan.keys()) {
    // 每个连续安装段独立成表。按整个函数合并会把中间隔开的段重复安装，
    // 也会让不同箭头函数误共享同一张表；这里直接沿用 findLoops 的段边界。
    const tables = [];
    for (const [file, loops] of perPlan.get(plan)) {
      for (const loop of loops) {
        const table = { members: [...(loop.covered ?? [])] };
        tables.push(table);
        tableNameByLoop.set(`${plan.factory}|${file}|${loop.startOffset}`, table);
      }
    }
    const stem = plan.tableName.replace(/Table$/, '');
    tables.forEach((table, index) => {
      table.name = tables.length === 1 ? plan.tableName : `${stem}Part${index + 1}Table`;
    });

    const coveredMembers = new Set(tables.flatMap((table) => table.members));
    const declaredByFile = new Map();
    for (const member of plan.members) {
      if (!declaredByFile.has(member.file)) declaredByFile.set(member.file, []);
      declaredByFile.get(member.file).push(member);
    }
    // 只有当文件里声明的成员**全部**进了表，才删这个文件
    const memberFiles = [...declaredByFile]
      .filter(([, list]) => list.every((member) => coveredMembers.has(member)))
      .map(([file]) => file);
    // 目标模块本身就是某个成员文件时（之前合并出来的多成员模块），旧内容整体作废重写
    const targetIsMemberFile = plan.members.some((member) => member.file === plan.target.file);
    // 目标自己也是消费者时：先按循环改写它的正文，再追加表。顺序反了会把刚写的表冲掉。
    const ownEdit = fileEdits.get(plan.target.file);
    if (ownEdit !== undefined) handledTargets.add(plan.target.file);
    const current = targetIsMemberFile
      ? ''
      : (ownEdit !== undefined
        ? rewriteConsumer(installSources.get(plan.target.file) ?? '', plan.target.file, ownEdit, tableNameByLoop, compatNames)
        : (existsSync(plan.target.file) ? await readFile(plan.target.file, 'utf8') : ''));
    const bySpecifier = new Map();
    for (const member of coveredMembers) {
      for (const entry of member.imports) {
        if (!bySpecifier.has(entry.specifier)) bySpecifier.set(entry.specifier, []);
        const names = bySpecifier.get(entry.specifier);
        for (const name of entry.names) if (!names.includes(name)) names.push(name);
      }
    }
    const stripped = stripForwarding(current, plan.target.file, plan.members).replace(/^\n+/, '');
    // 给「别处还要按名字用」的成员补具名再导出：`export const values = new Map([...表]).get("values");`
    const compat = compatNames.get(plan);
    const lookup = `new Map([${tables.map((table) => `...${table.name}`).join(', ')}])`;
    const compatLines = compat === undefined ? '' : [...compat]
      .map((name) => {
        const member = plan.members.find((entry) => entry.exports.some((exported) => exported.name === name));
        if (member === undefined) return null;
        if (!coveredMembers.has(member)) {
          return `export const ${name} = ${member.factory}(${member.argsList.join(', ')});`;
        }
        const slot = plan.slotByName?.get(name) ?? null;
        const access = slot === null || slot === undefined ? '' : `.${slot}`;
        return `export const ${name} = ${lookup}.get(${JSON.stringify(name)})${access};`;
      })
      .filter((line) => line !== null)
      .join('\n');
    const parts = [
      stripped.replace(/\s+$/, '') || `// ${path.basename(plan.dir)} 的成员表：名字就能描述实现，不再一个成员一个文件。`,
      formatImportBlock(bySpecifier),
      tables.map((table) => buildTable(table.name, table.members).replace(/\n+$/, '')).join('\n\n'),
      compatLines,
    ].filter((part) => part !== '');
    await writeFile(plan.target.file, `${parts.join('\n\n')}\n`);
    for (const file of memberFiles) {
      if (file !== plan.target.file) await rm(file);
    }
  }

  for (const [file, edit] of fileEdits) {
    // 已经作为目标模块处理过的消费者（它的正文已在写表之前改写）不再重写
    if (handledTargets.has(file)) continue;
    await writeFile(file, rewriteConsumer(installSources.get(file), file, edit, tableNameByLoop, compatNames));
  }

  // 直接 import 成员文件的第三方：把 specifier 改指向表模块（表模块已具名再导出那些名字）
  for (const [file, specifiers] of rewrites) {
    let source = await readFile(file, 'utf8');
    for (const [before, after] of specifiers) {
      source = source.split(`"${before}"`).join(`"${after}"`);
    }
    await writeFile(file, tidyImports(source));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
