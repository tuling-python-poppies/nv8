#!/usr/bin/env node
/**
 * 生成 Realm 模块预打包缓存。
 *
 * ## 为什么这必须是本地产物，而不能进版本库
 *
 * `RealmModuleLoader` 用 `url.href`（绝对 `file://` URL）作为缓存键。这意味着
 * 打包结果**与生成它的机器路径绑定**：在 `D:/develop_software/Nv8` 生成的包，
 * 到 `/home/user/Nv8` 上一个键都对不上。
 *
 * 仓库里曾提交过一份这样的包（3992 个键，全部以
 * `file:///D:/develop_software/Nv8/` 开头，15.8MB）。它在别的机器上命中率
 * **恒为 0**，却仍然要在每次进程启动时被 `readFileSync` + `JSON.parse` 一遍。
 * 实测冷启动因此慢约 90ms（526ms → 431ms）——一个负优化。
 *
 * 这是 ADR-0005「机器特定值不得进入身份」的同一条原则，用在构建产物上：
 * 机器特定的缓存属于本地，不属于版本库。
 *
 * 用法：
 *   node scripts/build-module-bundle.mjs          # 生成
 *   node scripts/build-module-bundle.mjs --check  # 只校验现有包是否匹配本机
 */

import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_ROOT = new URL('../src/', import.meta.url);
const OUTPUT = fileURLToPath(new URL('../src/realm/module-bundle.json', import.meta.url));

/** 引导入口。与 `module-loader.js` 的 `INTERNAL_MODULES` 保持一致。 */
const ENTRIES = [
  new URL('bootstrap/bootstrap-root.js', SOURCE_ROOT),
  new URL('bootstrap/bootstrap-worker.js', SOURCE_ROOT),
  new URL('bootstrap/bootstrap-worklet.js', SOURCE_ROOT),
];

/**
 * 抽取一个模块里的相对依赖。
 *
 * 加载器只处理 `SOURCE_ROOT` 之下的 `file:` URL，所以裸包名不必考虑。
 *
 * @param {string} source
 * @returns {string[]}
 */
function dependenciesOf(source) {
  const specifiers = [];
  const patterns = [
    /(?:^|[\s;{}])(?:import|export)[\s\S]{0,4000}?from\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (match[1].startsWith('.')) specifiers.push(match[1]);
    }
  }
  return specifiers;
}

/**
 * 从入口出发收集整张图。
 *
 * @returns {Promise<Map<string, string>>} identifier(href) → 源码
 */
async function collectGraph() {
  const bundle = new Map();
  const queue = [...ENTRIES];

  while (queue.length > 0) {
    const url = queue.pop();
    const identifier = url.href;
    if (bundle.has(identifier)) continue;

    let source;
    try {
      source = await readFile(fileURLToPath(url), 'utf8');
    } catch (error) {
      // 图里出现断链要吵出来，而不是静默少打包一个模块——
      // 那会退化成运行时按文件读，看起来"能跑"但没有优化
      throw new Error(`模块图断链：${identifier} 读取失败（${error.code}）`);
    }
    bundle.set(identifier, source);

    for (const specifier of dependenciesOf(source)) {
      const child = new URL(specifier, url);
      const resolved = await resolveFile(child);
      if (resolved !== null) queue.push(resolved);
    }
  }
  return bundle;
}

/**
 * 补全省略的扩展名与目录 index。
 *
 * @param {URL} url
 * @returns {Promise<URL|null>}
 */
async function resolveFile(url) {
  const candidates = [url, new URL(`${url.href}.js`), new URL(`${url.href}/index.js`)];
  for (const candidate of candidates) {
    try {
      if ((await stat(fileURLToPath(candidate))).isFile()) return candidate;
    } catch {
      // 试下一个
    }
  }
  return null;
}

const checkOnly = process.argv.includes('--check');
const graph = await collectGraph();
const payload = Object.fromEntries(graph);
const bytes = Buffer.byteLength(JSON.stringify(payload));

if (checkOnly) {
  let existing;
  try {
    existing = JSON.parse(await readFile(OUTPUT, 'utf8'));
  } catch {
    console.log('未生成模块包。运行 npm run build:bundle 可加速冷启动。');
    process.exit(0);
  }
  const keys = Object.keys(existing);
  const matching = keys.filter((key) => graph.has(key)).length;
  console.log(`模块包：${keys.length} 个键，其中 ${matching} 个匹配本机路径`);
  if (matching === 0 && keys.length > 0) {
    console.error(
      '这份包是在别的机器上生成的，命中率为 0，只会拖慢启动。'
      + '请删除或重新生成。'
    );
    process.exit(1);
  }
  process.exit(0);
}

await writeFile(OUTPUT, JSON.stringify(payload), 'utf8');
console.log(
  `已生成 ${path.relative(process.cwd(), OUTPUT)}：`
  + `${graph.size} 个模块，${(bytes / 1024 / 1024).toFixed(1)}MB`
);
console.log('注意：该文件与本机路径绑定，已在 .gitignore 中排除。');
