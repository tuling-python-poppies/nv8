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
 */

import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { maskSource } from './source-shape.mjs';

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
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
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

/** 解析一条 `工厂("名字", 其余参数)` 调用语句。 */
function parseFactoryCall(statement, allowPrivate) {
  const match = (allowPrivate
    ? /^const (\w+) = ([\w$]+)\(([\s\S]*)\);$/
    : /^export const (\w+) = ([\w$]+)\(([\s\S]*)\);$/
  ).exec(statement);
  if (match === null) return null;
  const [, binding, factory, callArgs] = match;
  const nameMatch = /^\s*"([^"]+)"/.exec(callArgs);
  if (nameMatch === null) return null;
  const rest = callArgs.slice(nameMatch[0].length).replace(/^\s*,\s*/, '').trim();
  if (rest.includes(';') || rest.includes('export')) return null;
  return { binding, factory, name: nameMatch[1], args: rest };
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
        if (factory === null) factory = call.factory;
        if (call.factory !== factory) return null;
        members.push({
          name: call.name,
          factory,
          args: call.args,
          kind: 'pair',
          exports: [{ name: getMatch[1], slot: 'get' }, { name: setMatch[1], slot: 'set' }],
        });
        index += 3;
        continue;
      }
      if (getMatch !== null) {
        if (factory === null) factory = call.factory;
        if (call.factory !== factory) return null;
        members.push({
          name: call.name,
          factory,
          args: call.args,
          kind: 'readonly',
          exports: [{ name: getMatch[1], slot: 'get' }],
        });
        index += 2;
        continue;
      }
    }

    const single = parseFactoryCall(statements[index], false);
    if (single === null) return null;
    if (factory === null) factory = single.factory;
    if (single.factory !== factory) return null;
    members.push({
      name: single.name,
      factory,
      args: single.args,
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
async function findTargetModule(dir, members) {
  const entries = await readdir(dir, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('-members.js'))
    .map((entry) => path.join(dir, entry.name));
  const bases = new Set(members.map((member) => path.basename(member.file)));
  const barrels = [];
  for (const candidate of candidates) {
    const source = await readFile(candidate, 'utf8');
    const forwarded = [...source.matchAll(REEXPORT_RE)].map((match) => path.basename(match[1]));
    if (forwarded.some((base) => bases.has(base))) barrels.push(candidate);
  }
  if (barrels.length === 1) return { file: barrels[0], existed: true };
  if (barrels.length > 1) return { ambiguous: barrels.map((file) => path.basename(file)) };
  const created = path.join(dir, `${kebab(members[0].factory)}-members.js`);
  return { file: created, existed: existsSync(created) };
}

/**
 * 生成表声明。
 *
 * 行只存「名字 + 额外字面量参数」，工厂调用在 map 里统一发生，所以 `animationProperty`、
 * `documentMethod` 这类签名不同的工厂可以共用同一形状。
 */
function buildTable(tableName, members) {
  const rowsName = `${tableName.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase()}_ROWS`;
  const rows = members
    .map((member) => `  ["${member.name}"${member.args ? `, ${member.args}` : ''}],`)
    .join('\n');
  return [
    `const ${rowsName} = [`,
    rows,
    '];',
    '',
    `export const ${tableName} = ${rowsName}.map(`,
    `  ([name, ...args]) => [name, ${members[0].factory}(name, ...args)],`,
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
function fileScope(source, filePath, families) {
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
  return { template: (out + line.slice(cursor)).trimStart(), slots: member.exports.map((entry) => entry.slot) };
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
  if (merged || lastEnd === -1) return expanded;
  return `${expanded.slice(0, lastEnd)}\nimport { ${name} } from "${specifier}";${expanded.slice(lastEnd)}`;
}

/** 整理 import 区：去掉空行，与正文之间留恰好一个空行。 */
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
function findLoops(source, scoped) {
  const lines = source.split('\n');
  const loops = [];
  let index = 0;
  while (index < lines.length) {
    const first = matchStatement(lines[index], scoped);
    if (first === null) {
      index += 1;
      continue;
    }
    let count = 1;
    while (index + count < lines.length) {
      const next = matchStatement(lines[index + count], scoped);
      if (next === null
        || next.template !== first.template
        || next.slotsKey !== first.slotsKey
        || next.scope !== first.scope) break;
      count += 1;
    }
    loops.push({ ...first, count, start: index, end: index + count });
    index += count;
  }
  return loops;
}

function matchStatement(line, scoped) {
  const trimmed = line.trim();
  if (!trimmed.endsWith(';') || !/^[\w$]+\(/.test(trimmed)) return null;
  const indent = line.slice(0, line.length - line.trimStart().length);
  for (const scope of scoped) {
    for (const member of scope.family.members) {
      const converted = toTemplate(line, member, scope);
      if (converted === null) continue;
      return { ...converted, slotsKey: converted.slots.join('|'), scope, indent };
    }
  }
  return null;
}

/**
 * 统计作用域内引用了本家族成员的行数。
 *
 * 用作覆盖闸门：如果「引用行数」多于「被循环覆盖的行数」，说明还有我认不出的用法，
 * 这时整个家族必须跳过——否则删掉成员文件后会留下悬空导入或静默少装成员。
 * 在挖空文本上匹配，字符串里的同名内容不算引用。
 */
function countReferences(source, scoped) {
  // 多行 import 的续行也会命中成员名，先把 import 语句整段摘掉再数
  const withoutImports = source
    .replace(/import\s*\{[^}]*\}\s*from\s*"[^"]+";/g, '')
    .replace(/import\s*\*\s*as\s+[\w$]+\s*from\s*"[^"]+";/g, '');
  let count = 0;
  for (const line of withoutImports.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('export {') || trimmed.startsWith('export *')) continue;
    const masked = maskSource(line);
    let hit = false;
    for (const scope of scoped) {
      for (const member of scope.family.members) {
        for (const entry of member.exports) {
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
  return source.replace(pattern, (whole, specifier) => (
    memberFiles.has(path.resolve(path.dirname(targetFile), specifier)) ? '' : whole
  ));
}

function formatImportBlock(bySpecifier) {
  return [...bySpecifier.entries()]
    .map(([specifier, names]) => (names.length === 1
      ? `import { ${names[0]} } from "${specifier}";`
      : `import {\n${names.map((name) => `  ${name},`).join('\n')}\n} from "${specifier}";`))
    .join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const onlyIndex = args.indexOf('--only');
  const only = onlyIndex === -1
    ? null
    : new Set(args.slice(onlyIndex + 1).filter((arg) => !arg.startsWith('--')));

  const apiFiles = (await walk(API_DIR)).filter((file) => !/-surface\.js$/.test(file));
  const grouped = new Map();
  for (const file of apiFiles) {
    const parsed = await readFamilyFile(file);
    if (parsed === null) continue;
    const dir = path.dirname(file);
    if (only !== null && !only.has(path.basename(dir))) continue;
    const key = `${dir}\u0000${parsed.factory}`;
    if (!grouped.has(key)) grouped.set(key, { dir, factory: parsed.factory, members: [] });
    const group = grouped.get(key);
    for (const member of parsed.members) {
      group.members.push({ file, imports: parsed.imports, ...member });
    }
  }

  const installFiles = await walk(INSTALL_DIR);
  const installSources = new Map();
  for (const file of installFiles) installSources.set(file, await readFile(file, 'utf8'));

  const plans = [];
  for (const group of grouped.values()) {
    const target = await findTargetModule(group.dir, group.members);
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
  const perPlan = new Map();
  const fileEdits = new Map();
  let totalLoops = 0;
  const skipped = [];
  for (const plan of plans) {
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

  for (const plan of plans) {
    const consumers = [...(perPlan.get(plan) ?? [])].map(
      ([file, loops]) => `${path.basename(file)}:${loops.reduce((sum, loop) => sum + loop.count, 0)}`,
    );
    console.log(
      `${String(plan.members.length).padStart(4)}  ${path.relative(ROOT, plan.dir).replace(/\\/g, '/').padEnd(24)}`
      + `${plan.factory.padEnd(32)} -> ${path.basename(plan.target.file).padEnd(40)} 循环: ${consumers.join(' ') || '无'}`,
    );
  }
  console.log(`\n合计 ${plans.length} 个家族、${plans.reduce((sum, plan) => sum + plan.members.length, 0)} 个成员文件、`
    + `${totalLoops} 段循环、${fileEdits.size} 个安装文件待改` + (write ? '（已落盘）' : '（dry-run）'));
  if (skipped.length > 0) {
    console.log(`\n因覆盖不全而跳过 ${skipped.length} 个家族：`);
    for (const entry of skipped.slice(0, 15)) console.log(`  ${entry}`);
  }

  if (!write) return;

  for (const plan of perPlan.keys()) {
    const memberFiles = [...new Set(plan.members.map((member) => member.file))];
    // 目标模块本身就是某个成员文件时（之前合并出来的多成员模块），旧内容整体作废重写
    const targetIsMemberFile = memberFiles.includes(plan.target.file);
    const current = !targetIsMemberFile && existsSync(plan.target.file)
      ? await readFile(plan.target.file, 'utf8')
      : '';
    const bySpecifier = new Map();
    for (const member of plan.members) {
      for (const entry of member.imports) {
        if (!bySpecifier.has(entry.specifier)) bySpecifier.set(entry.specifier, []);
        const names = bySpecifier.get(entry.specifier);
        for (const name of entry.names) if (!names.includes(name)) names.push(name);
      }
    }
    const stripped = stripForwarding(current, plan.target.file, plan.members).replace(/^\n+/, '');
    const parts = [
      stripped.replace(/\s+$/, '') || `// ${path.basename(plan.dir)} 的成员表：名字就能描述实现，不再一个成员一个文件。`,
      formatImportBlock(bySpecifier),
      buildTable(plan.tableName, plan.members),
    ].filter((part) => part !== '');
    await writeFile(plan.target.file, `${parts.join('\n\n')}\n`);
    for (const file of memberFiles) {
      if (file !== plan.target.file) await rm(file);
    }
  }

  for (const [file, edit] of fileEdits) {
    let source = installSources.get(file);
    const lines = source.split('\n');
    for (const loop of [...edit.loops].sort((a, b) => b.start - a.start)) {
      const ref = loop.scope.namespace === null
        ? loop.plan.tableName
        : `${loop.scope.namespace}.${loop.plan.tableName}`;
      lines.splice(
        loop.start,
        loop.count,
        `${loop.indent}for (const [name, entry] of ${ref}) ${fillTemplate(loop.template, loop.slots)}`,
      );
    }
    source = lines.join('\n');
    source = dropNamedImports(source, file, edit.drops);
    for (const [tableName, specifier] of edit.adds) {
      source = addNamedImport(source, tableName, specifier);
    }
    await writeFile(file, tidyImports(source));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
