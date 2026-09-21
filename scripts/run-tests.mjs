#!/usr/bin/env node
/**
 * `npm test` 的入口：给 `node --test` 一个与机器规模匹配的文件并发度。
 *
 * `node --test` 的默认并发是 `availableParallelism() - 1`。每个测试文件都会拉起
 * 自己的 EdgeSandbox 子进程并编译数千个 VM 模块，所以在**核多内存少**的机器上
 * （28 核 / 8GB 的 WSL）27 路并行会把 CPU 和磁盘打满，露出两类假失败：
 *
 * - Realm 引导的 5s 兜底 deadline 超时（ERR_EDGE_SANDBOX_TIMEOUT）；
 * - 依赖 wall-clock 的断言，如 engine-lifecycle-fix-test.js 的
 *   `Date.now() - started < 2000`（被等的 worker 自己的超时只有 300ms）。
 *
 * 本机实测：27 路 → 1258/1259（97s）；8 路 → 1259/1259（128s）；7 路 → 全绿（149s）；4 路 → 全绿（208s）。
 * 这些失败与产品行为无关，是测试编排把机器压过头。
 *
 * 上限取 `min(8, 核数 - 1, 内存/1GiB)` 而不是固定 8：CI runner 只有 2–4 核，
 * 取 min 后与 Node 默认并发一致，不会在弱机器上反而加剧争抢。内存项是低内存
 * 机器的保险丝：8GB 的 WSL VM 实际报 7.64GiB，floor 后取 7（已实测全绿，≈1GiB/文件），
 * 只有内存更低的机器才会继续降档。WSL 下 totalmem() 返回虚拟机内存，正好
 * 对上这里要压的边界。
 *
 * `--test-concurrency` 要求 Node ≥ 18.19（18.18 会直接 `bad option`），所以更低
 * 版本回退到 Node 默认并发——支持下限仍是 18.18。
 */
import { spawn } from 'node:child_process';
import { availableParallelism, totalmem } from 'node:os';

const MAX_TEST_CONCURRENCY = 8;
const MEMORY_PER_WORKER_BYTES = 1024 ** 3;
const [major, minor] = process.versions.node.split('.').map(Number);

const flags = ['--experimental-vm-modules', '--test'];
if (major > 18 || (major === 18 && minor >= 19)) {
  const concurrency = Math.min(
    MAX_TEST_CONCURRENCY,
    Math.max(1, availableParallelism() - 1),
    Math.max(1, Math.floor(totalmem() / MEMORY_PER_WORKER_BYTES)),
  );
  flags.push(`--test-concurrency=${concurrency}`);
}

// 其余参数透传，`npm test -- tests/x.js` 仍然可用。
const child = spawn(process.execPath, [...flags, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal !== null) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
