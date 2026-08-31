#!/usr/bin/env node
/**
 * 宿主 ESM 图的模块级可变状态审计。
 *
 * 背景：经 RealmModuleLoader 加载的模块在每个 Realm 都会得到新实例，
 * 因此那条路径上的模块级状态天然是 Realm 隔离的。真正会跨 Sandbox
 * 泄漏的是**宿主 ESM 图**——即从 src/index.js 和各插件 index.js 直接
 * import 进来的模块，它们在整个进程里只有一份。
 *
 * 本脚本只统计宿主图内的可变模块级状态，作为迁移进度的客观口径。
 *
 * 用法：
 *   node scripts/audit-module-state.mjs           # 打印明细
 *   node scripts/audit-module-state.mjs --json    # 机器可读
 *   node scripts/audit-module-state.mjs --max 75  # 超过阈值即失败
 */

import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

/** 只审计这些前缀下的实现模块 */
const AUDITED_PREFIXES = [
  'src/api/',
  'src/navigation/',
  'src/scheduler/',
  'src/webidl/',
  'src/trace/',
];

/**
 * 已审阅并判定为“应当是进程级”的状态。
 *
 * 记在这里而不是直接忽略，是为了让“为何不迁移”有略可查；
 * 任何新增项都必须写明理由，而不是默默加进白名单。
 */
const REVIEWED_PROCESS_LEVEL_STATE = new Map([
  ['src/api/clone/structured-clone-algorithm.js:transferHandlers',
    '扩展点注册表：由 install-* 在启动时注册类型处理器，属于能力声明而非运行时数据'],
  ['src/api/crypto/hash.js:sha512Constants',
    'SHA-512 轮常量的惰性缓存：纯不可变数学常量，跨 Realm 共享无可观察差异'],
  ['src/webidl/native-function-realm-safe.js:realmContexts',
    '按 Realm ID 索引的上下文注册表：它本身就是跨 Realm 管理器，隔离它会让其失去意义'],
  ['src/webidl/native-function.js:currentContext',
    '安装期的当前上下文指针：由 setNativeFunctionContext() 在 Realm 激活时设置并在安装后失效'],
]);

function collectHostGraph() {
  const roots = [
    'src/index.js',
    'src/public/create-sandbox.js',
    'src/public/edge-sandbox.js',
    ...execSync('ls src/plugins/*/index.js', { cwd: ROOT, encoding: 'utf8' })
      .trim().split('\n'),
  ].map((entry) => path.resolve(ROOT, entry));

  const seen = new Set();
  const queue = [...roots];

  while (queue.length > 0) {
    const file = queue.pop();
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
      queue.push(path.resolve(path.dirname(file), match[1]));
    }
  }
  return seen;
}

/**
 * 统计单个文件内的可变模块级状态。
 *
 * 判定规则：
 * - 顶层 `let` 一律计入（模块级可变绑定）
 * - 顶层 `const x = new Map()/new Set()` 仅当文件内出现 mutation 调用时计入
 *   （纯查表用的常量集合不算状态）
 */
function countMutableState(source) {
  const findings = [];
  source.split('\n').forEach((line, index) => {
    const letMatch = /^let\s+(\w+)/.exec(line);
    if (letMatch) {
      findings.push({ kind: 'let', name: letMatch[1], line: index + 1 });
      return;
    }
    const collectionMatch = /^const\s+(\w+)\s*=\s*new\s+(Map|Set)\s*\(/.exec(line);
    if (collectionMatch) {
      const [, name, type] = collectionMatch;
      const mutated = new RegExp(`\\b${name}\\.(set|add|delete|clear)\\(`).test(source);
      if (mutated) findings.push({ kind: `const ${type}`, name, line: index + 1 });
    }
  });
  return findings;
}

function audit() {
  const graph = collectHostGraph();
  const files = [];
  const exempt = [];

  for (const file of [...graph].sort()) {
    const relative = path.relative(ROOT, file);
    if (!AUDITED_PREFIXES.some((prefix) => relative.startsWith(prefix))) continue;
    const findings = countMutableState(readFileSync(file, 'utf8'));

    const remaining = [];
    for (const finding of findings) {
      const key = `${relative}:${finding.name}`;
      const reason = REVIEWED_PROCESS_LEVEL_STATE.get(key);
      if (reason === undefined) {
        remaining.push(finding);
      } else {
        exempt.push({ ...finding, file: relative, reason });
      }
    }

    if (remaining.length > 0) files.push({ file: relative, findings: remaining });
  }

  files.sort((a, b) => b.findings.length - a.findings.length
    || a.file.localeCompare(b.file));
  exempt.sort((a, b) => a.file.localeCompare(b.file));

  return {
    hostGraphModules: graph.size,
    fileCount: files.length,
    stateCount: files.reduce((sum, entry) => sum + entry.findings.length, 0),
    files,
    exemptCount: exempt.length,
    exempt,
  };
}

const result = audit();
const args = process.argv.slice(2);

if (args.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`宿主 ESM 图模块数      : ${result.hostGraphModules}`);
  console.log(`待迁移的文件          : ${result.fileCount}`);
  console.log(`待迁移的模块级状态    : ${result.stateCount}`);
  console.log(`已审阅的进程级状态    : ${result.exemptCount}`);
  console.log('');
  for (const entry of result.files) {
    console.log(`${String(entry.findings.length).padStart(2)}  ${entry.file}`);
    for (const finding of entry.findings) {
      console.log(`      L${finding.line} ${finding.kind} ${finding.name}`);
    }
  }
  if (result.exempt.length > 0) {
    console.log('\n已审阅保留为进程级的状态：');
    for (const entry of result.exempt) {
      console.log(`  ${entry.file}:${entry.line} ${entry.name}`);
      console.log(`      ${entry.reason}`);
    }
  }
}

const maxIndex = args.indexOf('--max');
if (maxIndex !== -1) {
  const limit = Number(args[maxIndex + 1]);
  if (!Number.isFinite(limit)) {
    console.error('--max 需要一个数值');
    process.exit(2);
  }
  if (result.stateCount > limit) {
    console.error(
      `\n模块级状态数 ${result.stateCount} 超过阈值 ${limit}——只允许下降，不允许新增。`
    );
    process.exit(1);
  }
}
