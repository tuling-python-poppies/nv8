#!/usr/bin/env node
/**
 * 一次性迁移：把 `src/surface/api/**` 里「一个成员一个文件」的纯委托文件合并进所属目录的
 * `*-members.js`，减少 Realm 模块图的节点数。
 *
 * 判定「纯委托」的条件很窄：整个文件去掉 `import` 与注释后只剩一条
 * `export const NAME = factory(args…);`。这类文件没有任何独立逻辑，合并不会改变行为——
 * 导入方拿到的还是同一个名字、同一个值。
 *
 * 按「目录 + 工厂」分组：同一个工厂产出的成员放一起。目标模块优先复用目录里**已经导入该
 * 工厂**的 `-members.js`（例如 `css-transform-members.js`），没有就按工厂名新建
 * `<factory-kebab>-members.js`。这样同一目录可以有多组成员模块，也避免不同接口的同名成员
 * （`width`、`readyState` 之类）在合并后撞名。
 *
 * 导入方（目前都是 `src/surface/install/install-*.js`）从被删文件改指向目标模块，同一模块的
 * 命名导入会合并成一条语句。
 *
 * 用法：
 *   node scripts/merge-api-members.mjs            # 报告
 *   node scripts/merge-api-members.mjs --write    # 落盘
 */

import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_DIR = path.join(ROOT, 'src', 'surface', 'api');

const DELEGATE_BODY = /^export const (\w+)\s*=\s*([\w$]+)\(([\s\S]*)\);$/;
/**
 * 桶里的转发语句：`export * from "…"` 与具名 `export { a, b } from "…"` 都要认。
 *
 * 返回新正则而不是共用常量：带 `g` 的正则在多次 `matchAll` 之间会共享 `lastIndex`，
 * 复用会静默漏掉前半段。
 */
function reexportPattern() {
  return /export\s*(?:\*|\{[^}]*\})\s*from\s*"([^"]+)";\n?/g;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

function relative(from, to) {
  const rel = path.relative(path.dirname(from), to).split(path.sep).join('/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** 读出一个文件里的 `import { ... } from "..."` 语句。 */
function namedImports(source) {
  const imports = [];
  const pattern = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g;
  for (const match of source.matchAll(pattern)) {
    imports.push({
      specifier: match[2],
      names: match[1].split(',').map((name) => name.trim()).filter(Boolean),
    });
  }
  return imports;
}

/**
 * 收集所有引用了被删文件的语句。
 *
 * 仓库里 `-members.js` 是桶：一行 `export * from "./单个成员.js";`。合并成员之后这些行
 * 会变成自引用，必须删掉；出现在别的桶里的则要改指向新的归属模块。
 */
function collectReferences(contents, targetBySource) {
  const references = new Map();
  const importPattern = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g;
  for (const [file, source] of contents) {
    const imports = [];
    for (const match of source.matchAll(importPattern)) {
      const target = targetBySource.get(path.resolve(path.dirname(file), match[2]));
      if (target !== undefined) imports.push({ specifier: match[2], target });
    }
    const reexports = [];
    for (const match of source.matchAll(reexportPattern())) {
      const target = targetBySource.get(path.resolve(path.dirname(file), match[1]));
      if (target !== undefined) reexports.push({ specifier: match[1], target, whole: match[0] });
    }
    if (imports.length > 0 || reexports.length > 0) references.set(file, { imports, reexports });
  }
  return references;
}

/**
 * 解析出「纯委托」文件：去掉 import 与注释后只剩一条 `export const NAME = factory(…);`。
 *
 * 允许文件带多个 import（`documentMethod` 那批同时导入工厂和一个操作函数），但要求工厂名
 * 确实来自某个 import，并且参数里不含分号——否则 `export const a = f(x);\nmoreCode();`
 * 会被贪婪匹配成一条超长调用。
 */
async function readDelegate(file) {
  const source = await readFile(file, 'utf8');
  const importPattern = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g;
  const imports = [];
  for (const match of source.matchAll(importPattern)) {
    imports.push({
      specifier: match[2],
      names: match[1].split(',').map((name) => name.trim()).filter(Boolean),
    });
  }
  if (imports.length === 0) return null;

  const body = source.replace(importPattern, '').replace(/\/\/[^\n]*/g, '').trim();
  const match = /^export const ([\w$]+) = ([\w$]+)\(([\s\S]*)\);$/.exec(body);
  if (match === null || match[3].includes(';')) return null;
  const [, name, factory] = match;
  const provider = imports.find((entry) => entry.names.includes(factory));
  if (provider === undefined) return null;
  return { name, factory, factorySource: provider.specifier, imports, body };
}

/** 把 `specifier -> [names]` 渲染成 import 语句块。 */
function formatNamedImports(bySpecifier) {
  return [...bySpecifier.entries()]
    .map(([specifier, names]) => (names.length === 1
      ? `import { ${names[0]} } from "${specifier}";`
      : `import {\n${names.map((name) => `  ${name},`).join('\n')}\n} from "${specifier}";`))
    .join('\n');
}

/**
 * 目标模块：优先复用目录里**已经 `export *` 了这组成员**的 `-members.js`（仓库里
 * `-members.js` 就是这种桶），其次是导入该工厂的模块，都没有才按工厂名新建。
 *
 * 复用桶是关键：`canvas-2d-context-members.js` 里 73 行 `export *` 正是这组成员，
 * 把成员就地内联进去、删掉对应行，才算真的减少节点；另起炉灶反而会留下一堆孤立模块。
 */
async function findTargetModule(dir, delegates) {
  const entries = await readdir(dir, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('-members.js'))
    .map((entry) => path.join(dir, entry.name));
  const delegateBases = new Set(delegates.map((delegate) => path.basename(delegate.file)));
  const factory = delegates[0].factory;
  const factorySource = path.resolve(dir, delegates[0].factorySource);

  const barrels = [];
  const importers = [];
  for (const candidate of candidates) {
    const source = await readFile(candidate, 'utf8');
    const reexports = [...source.matchAll(reexportPattern())]
      .map((match) => path.basename(match[1]));
    if (reexports.some((base) => delegateBases.has(base))) barrels.push(candidate);
    const imports = namedImports(source).some((entry) => (
      entry.names.includes(factory)
      && path.resolve(dir, entry.specifier) === factorySource
    ));
    if (imports) importers.push(candidate);
  }

  for (const [matches, label] of [[barrels, '桶'], [importers, '导入方']]) {
    if (matches.length === 1) return { file: matches[0], existed: true, via: label };
    if (matches.length > 1) return { ambiguous: matches.map((file) => path.basename(file)) };
  }

  const created = path.join(dir, `${kebab(factory)}-members.js`);
  if (existsSync(created)) {
    return { file: created, existed: true, via: '同名模块' };
  }
  return { file: created, existed: false, via: '新建' };
}

async function main() {
  const write = process.argv.includes('--write');
  const apiFiles = await walk(API_DIR);

  const groups = new Map();
  for (const file of apiFiles) {
    const delegate = await readDelegate(file);
    if (delegate === null) continue;
    const dir = path.dirname(file);
    const key = `${dir}\u0000${delegate.factory}`;
    if (!groups.has(key)) groups.set(key, { dir, factory: delegate.factory, delegates: [] });
    groups.get(key).delegates.push({ file, ...delegate });
  }

  const srcFiles = await walk(path.join(ROOT, 'src'));
  const testFiles = (await walk(path.join(ROOT, 'tests')));
  const searchable = [...srcFiles, ...testFiles];
  const contents = new Map();
  for (const file of searchable) contents.set(file, await readFile(file, 'utf8'));

  const plans = [];
  for (const group of [...groups.values()].sort((a, b) => (
    a.dir.localeCompare(b.dir) || a.factory.localeCompare(b.factory)
  ))) {
    const { dir, delegates } = group;
    const target = await findTargetModule(dir, delegates);
    if (target.ambiguous !== undefined) {
      console.log(`SKIP ${path.relative(ROOT, dir)} ${group.factory}：多个候选模块（${target.ambiguous.join(', ')}）`);
      continue;
    }
    const names = new Set();
    const collisions = [];
    for (const delegate of delegates) {
      if (names.has(delegate.name)) collisions.push(delegate.name);
      names.add(delegate.name);
    }
    if (collisions.length > 0) {
      console.log(`SKIP ${path.relative(ROOT, dir)} ${group.factory}：合并后导出名冲突（${collisions.join(', ')}）`);
      continue;
    }
    if (target.existed) {
      const existingSource = contents.get(target.file) ?? await readFile(target.file, 'utf8');
      const already = [...names].filter((name) => (
        new RegExp(`export\\s+(?:const|function)\\s+${name}\\b`).test(existingSource)
      ));
      if (already.length > 0) {
        console.log(`SKIP ${path.relative(ROOT, dir)} ${group.factory}：目标模块已导出（${already.join(', ')}）`);
        continue;
      }
    }
    plans.push({ ...group, target });
  }

  const targetBySource = new Map();
  for (const plan of plans) {
    for (const delegate of plan.delegates) {
      targetBySource.set(delegate.file, plan.target.file);
    }
  }

  const references = collectReferences(contents, targetBySource);
  const referenceCounts = new Map();
  const repointTargets = new Set();
  for (const [file, entry] of references) {
    for (const hit of [...entry.imports, ...entry.reexports]) {
      referenceCounts.set(hit.target, (referenceCounts.get(hit.target) ?? 0) + 1);
    }
    for (const hit of entry.reexports) {
      if (file !== hit.target) repointTargets.add(`${path.relative(ROOT, file)} -> ${path.relative(ROOT, hit.target)}`);
    }
  }

  let totalFiles = 0;
  for (const plan of plans) {
    totalFiles += plan.delegates.length;
    console.log(
      `${String(plan.delegates.length).padStart(4)} 个文件 -> ${relative(plan.dir, plan.target.file)}`
      + `（${plan.target.via}）  引用 ${referenceCounts.get(plan.target.file) ?? 0} 处`,
    );
  }
  console.log(`合计：${plans.length} 个目录、${totalFiles} 个文件` + (write ? '（已落盘）' : '（dry-run）'));
  if (repointTargets.size > 0) {
    console.log(`\n非目标文件里的 export * 需要改指向（${repointTargets.size} 处）：`);
    for (const entry of [...repointTargets].slice(0, 10)) console.log(`  ${entry}`);
  }

  if (!write) return;

  const deleted = new Set();
  for (const plan of plans) for (const delegate of plan.delegates) deleted.add(delegate.file);

  for (const plan of plans) {
    let header = '';
    if (!plan.target.existed) {
      header = `// ${path.basename(plan.dir)} 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。\n\n`;
    }
    const bySpecifier = new Map();
    for (const delegate of plan.delegates) {
      for (const entry of delegate.imports) {
        if (!bySpecifier.has(entry.specifier)) bySpecifier.set(entry.specifier, []);
        const names = bySpecifier.get(entry.specifier);
        for (const name of entry.names) if (!names.includes(name)) names.push(name);
      }
    }
    const memberLines = plan.delegates
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((delegate) => delegate.body)
      .join('\n');
    const addition = `${formatNamedImports(bySpecifier)}\n\n${memberLines}\n`;

    if (plan.target.existed) {
      const current = await readFile(plan.target.file, 'utf8');
      await writeFile(plan.target.file, `${current.replace(/\n$/, '')}\n\n${header}${addition}`);
    } else {
      await writeFile(plan.target.file, `${header}${addition}`);
    }

    for (const delegate of plan.delegates) await rm(delegate.file);

  }

  for (const [file, entry] of references) {
    // 目标桶刚被追加过成员，必须读盘取最新内容，不能用建计划时的快照。
    if (deleted.has(file)) continue;
    let source = await readFile(file, 'utf8');
    for (const hit of entry.reexports) {
      // 目标桶里指向自己成员的 `export *` 会变成自引用，直接删行。
      if (file === hit.target) {
        source = source.replace(hit.whole, '');
        continue;
      }
      source = source.split(`"${hit.specifier}"`).join(`"${relative(file, hit.target)}"`);
    }
    for (const hit of entry.imports) {
      source = source.split(`"${hit.specifier}"`).join(`"${relative(file, hit.target)}"`);
    }
    await writeFile(file, coalesceNamedImports(source));
  }
}

/**
 * 把指向同一模块的多条命名导入合并成一条。
 *
 * 合并前 `install-blob.js` 会留下 8 条 `from "../api/file/file-members.js"`，读起来跟
 * 摊平代码一样糟；合并顺序按首次出现，名字去重。
 */
export function coalesceNamedImports(source) {
  const pattern = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)";/g;
  const matches = [...source.matchAll(pattern)];
  if (matches.length === 0) return source;

  const bySpecifier = new Map();
  for (const match of matches) {
    const specifier = match[2];
    if (!bySpecifier.has(specifier)) bySpecifier.set(specifier, { names: [], count: 0 });
    const entry = bySpecifier.get(specifier);
    entry.count += 1;
    for (const name of match[1].split(',').map((value) => value.trim()).filter(Boolean)) {
      if (!entry.names.includes(name)) entry.names.push(name);
    }
  }

  let out = '';
  let cursor = 0;
  const emitted = new Set();
  for (const match of matches) {
    const specifier = match[2];
    const entry = bySpecifier.get(specifier);
    out += source.slice(cursor, match.index);
    cursor = match.index + match[0].length;
    if (entry.count < 2) {
      out += match[0];
      continue;
    }
    if (emitted.has(specifier)) continue;
    emitted.add(specifier);
    out += entry.names.length === 1
      ? `import { ${entry.names[0]} } from "${specifier}";`
      : `import {\n${entry.names.map((name) => `  ${name},`).join('\n')}\n} from "${specifier}";`;
  }
  return tidyImportHeader(out + source.slice(cursor));
}

/**
 * 整理文件头部的 import 区：去掉其中的空行，并在 import 区与正文之间留恰好一个空行。
 *
 * 合并导入会删掉若干条语句、留下它们的换行，出现一堆孤立空行；多行 import 内部的换行
 * 是「换行 + 缩进 + 内容」，不会被 `\n\s*\n` 命中，所以安全。
 */
export function tidyImportHeader(source) {
  const pattern = /import\s+(?:[\w$]+\s*,?\s*)?(?:\{[^}]*\}|\*\s*as\s+[\w$]+)\s*from\s*"[^"]+";|import\s+"[^"]+";/g;
  let end = 0;
  for (const match of source.matchAll(pattern)) end = match.index + match[0].length;
  if (end === 0) return source;

  const header = source.slice(0, end).replace(/\n\s*\n/g, '\n').replace(/\s+$/, '');
  const rest = source.slice(end).replace(/^\s+/, '');
  return rest === '' ? `${header}\n` : `${header}\n\n${rest}`;
}

await main();
