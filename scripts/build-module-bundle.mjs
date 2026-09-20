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
import vm from 'node:vm';

const SOURCE_ROOT = new URL('../src/', import.meta.url);
const OUTPUT = fileURLToPath(
  new URL('../src/engine/realm/module-bundle.json', import.meta.url),
);

/** 引导入口。与 `module-loader.js` 的 `INTERNAL_MODULES` 保持一致。 */
const ENTRIES = [
  new URL('engine/bootstrap/bootstrap-root.js', SOURCE_ROOT),
  new URL('engine/bootstrap/bootstrap-worker.js', SOURCE_ROOT),
  new URL('engine/bootstrap/bootstrap-worklet.js', SOURCE_ROOT),
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

/**
 * 为每个模块预生成 V8 字节码缓存（`cachedData`）。
 *
 * 加载器把 `cachedData` 交给 `new vm.SourceTextModule`，跳过源码解析+编译。
 * 实测 4025 个模块从 134ms（纯源码）降到 58ms（带缓存），每个 Realm 省约 76ms，
 * 直接惠及冷启动与每次 Realm 创建。
 *
 * `cachedData` 与生成它的 V8 版本绑定：在别的 Node 大版本上会被 V8 判为失效。
 * 加载器对失效缓存**静默回退到源码编译**（module-loader.js 的 cachedData 分支），
 * 所以版本不匹配只是回到今天的行为，不会出错。这与「bundle 是本机产物」是同一
 * 前提——在部署用的 Node 版本上本地生成即可。
 *
 * 只做**编译**（构造 SourceTextModule），不做链接/求值，因此不触发任何模块副作用。
 *
 * @param {Map<string, string>} graph identifier(href) → 源码
 * @returns {{payload: object, cached: number, total: number}}
 */
function withCachedData(graph) {
  // 字节码缓存是优化，不是必需。没有 --experimental-vm-modules 时优雅降级为
  // 纯源码包（老行为），而不是把构建变成硬错——调用方仍能拿到可用的包。
  if (typeof vm.SourceTextModule !== 'function') {
    return { payload: Object.fromEntries(graph), cached: 0, total: graph.size };
  }
  const context = vm.createContext({});
  const payload = {};
  let cached = 0;
  for (const [identifier, source] of graph) {
    let cachedData = null;
    try {
      const module = new vm.SourceTextModule(source, {
        identifier,
        context,
        // 只用于构造；这里不会求值，noop 即可，避免解析期报缺失回调
        importModuleDynamically() {
          throw new Error('not evaluated during bundling');
        },
      });
      const data = module.createCachedData();
      if (data && data.length > 0) {
        cachedData = data.toString('base64');
        cached += 1;
      }
    } catch {
      // 单个模块编译失败不该让整包失败：退回纯源码条目，运行时按文件/源码走
    }
    payload[identifier] = cachedData === null ? source : { source, cachedData };
  }
  return { payload, cached, total: graph.size };
}

const checkOnly = process.argv.includes('--check');
const graph = await collectGraph();

if (checkOnly) {
  let existing;
  try {
    existing = JSON.parse(await readFile(OUTPUT, 'utf8'));
  } catch {
    console.error('模块包不存在。先运行 npm run build:bundle，再执行 check:bundle。');
    process.exit(1);
  }
  const keys = Object.keys(existing);
  const matching = keys.filter((key) => graph.has(key)).length;
  console.log(`模块包：${keys.length} 个键，其中 ${matching} 个匹配本机路径`);
  if (keys.length !== graph.size || keys.some(key => {
    const entry = existing[key];
    return !graph.has(key) || (typeof entry === 'string' ? entry : entry?.source) !== graph.get(key);
  })) {
    console.error('模块包的模块集合或源码已过期，请重新运行 build:bundle。');
    process.exit(1);
  }
  if (matching === 0 && keys.length > 0) {
    console.error(
      '这份包是在别的机器上生成的，命中率为 0，只会拖慢启动。'
      + '请删除或重新生成。'
    );
    process.exit(1);
  }
  process.exit(0);
}

const { payload, cached, total } = withCachedData(graph);
const bytes = Buffer.byteLength(JSON.stringify(payload));

await writeFile(OUTPUT, JSON.stringify(payload), 'utf8');
console.log(
  `已生成 ${path.relative(process.cwd(), OUTPUT)}：`
  + `${graph.size} 个模块，${(bytes / 1024 / 1024).toFixed(1)}MB`
);
if (cached === total && total > 0) {
  console.log(
    `字节码缓存：${cached}/${total} 个模块（V8 ${process.versions.v8}）；`
    + '版本不匹配时加载器静默回退源码编译。',
  );
} else if (cached === 0) {
  console.log(
    '未生成字节码缓存（需 --experimental-vm-modules，已降级为纯源码包）；'
    + '用 `npm run build:bundle` 可启用字节码缓存，进一步缩短冷启动。',
  );
} else {
  console.log(`字节码缓存：${cached}/${total} 个模块（部分）。`);
}
console.log('注意：该文件与本机路径 + V8 版本绑定，已在 .gitignore 中排除。');
