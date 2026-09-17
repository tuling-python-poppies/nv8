# 后端基准与子进程 profile（B2）

> 数据日期：2026-09-17 · 主机：Windows（本机） · Node 22.22.2 为 profile 基准，
> 矩阵覆盖 18.20.8 / 20.20.2 / 22.22.2 / 24.11.0。
>
> 绝对耗时依主机而定；本页用于**同机对照**与决策记录，不是回归门禁。
> 数量级护栏在 `tests/performance-budget-test.js`。

## 1. 方法

```bash
npm run benchmark -- --iterations 8 --backend child-process --json
npm run benchmark -- --iterations 8 --backend worker-thread  --json
npm run benchmark:matrix -- --iterations 8      # 4 个 Node 版本 × 2 backend
```

`benchmark.mjs` 的五个维度：冷启动（create → 首次 run）、热复用（单次 run）、
签名工作流（`evaluateWithPayload` 载 256KiB 命名载荷的单次求值）、崩溃恢复
（`execution.restart="restart"`，超时崩溃 → 下一次求值可用）、Realm 创建+销毁。
矩阵对每个后端跑两遍（下称 run2 / run3），中位数用于对照。

**注意**：以下矩阵数据在 `src/engine/realm/module-bundle.json` **不存在**时采集
（即全新克隆的默认状态）；有/无预打包 bundle 的对照见第 4 节。

## 2. 后端对照（run2，中位数 ms）

| Node | backend | 冷启动 | 热复用 | 签名(256KiB) | 崩溃恢复 | Realm reset | Realm 创建+销毁 |
|---|---|---|---|---|---|---|---|
| 18.20.8 | child-process | 812.6 | 0.10 | 0.47 | 1109.9 | 266.5 | 801.1 |
| 18.20.8 | worker-thread | 755.4 | 0.06 | 0.45 | 1055.7 | 267.8 | 811.3 |
| 20.20.2 | child-process | 826.1 | 0.11 | 0.49 | 1116.5 | 305.0 | 860.7 |
| 20.20.2 | worker-thread | 699.1 | 0.06 | 0.44 | 1002.8 | 293.0 | 699.9 |
| 22.22.2 | child-process | 798.5 | 0.09 | 0.84 | 1087.4 | 281.8 | 764.8 |
| 22.22.2 | worker-thread | 707.7 | 0.07 | 0.46 | 1008.8 | 278.5 | 700.1 |
| 24.11.0 | child-process | 703.8 | 0.11 | 0.82 | 1010.2 | 262.8 | 695.4 |
| 24.11.0 | worker-thread | 607.1 | 0.08 | 0.48 | 911.5 | 264.1 | 597.9 |

run3 与 run2 的相对差异一般在 ±10% 以内；两次运行都出现过**孤立的长尾行**
（如 run3 的 22/worker 冷启动 968.9ms、24/worker 崩溃恢复 3.6s，同行的 reset/realm
一起抬高），属于主机侧抖动而非后端特性。RSS Δ 受 GC 时机影响可正可负，**本方法
不用于比较内存**。

结论：

- **默认后端保持 `child-process` 不变**：worker-thread 在同机冷启动/恢复上稳定
  快 5%–15%，但伴随更高的长尾方差，且放弃进程级隔离（内存上限、崩溃兜底）。
  这个量级不足以交换隔离模型。worker-thread 作为可选后端保留（低延迟、单租户、
  已自行做崩溃处理时可用）。
- 签名单次求值（256KiB 载荷）两个后端都是**亚毫秒级中位数**（0.4–0.9ms）；
  22/24 上 child-process 略高的约 0.35ms 在 3 次运行中可复现，但相对绝对值
  仍属同一量级，不构成换后端的理由。
- 崩溃恢复 ≈ 超时阈值 + 一次冷启动；批量场景应复用常驻实例而不是靠重启。

## 3. 子进程 CPU profile（Node 22 / child-process / 无 bundle）

父进程（4046ms 采样跨度）：**3951ms 是 idle**，实际 CPU 约 95ms（spawn 30ms、
选项归一化 12ms、协议编码若干）。父进程只在等待——与旧结论一致，瓶颈在子进程。

子进程（944ms 采样跨度，599 样本）自身耗时 Top：

| self 时间 | 位置 |
|---|---|
| 275.1ms | `readFileUtf8`（native，读 4000+ 个 realm 源文件） |
| 162.1ms | `Module`（`node:internal/vm/module`，ESM 实例化/链接） |
| 61.4ms | `createCachedData`（V8 编译缓存生成） |
| 49.2ms | GC |
| 42.4ms | `parse` |
| ~110ms | 其余 ESM 编译/链接、GC 辅助、`_copyActual` 等 |

按区域聚合（self time）：**node 内部 775.0ms（82.1%）**、surface 67.3ms（7.1%）、
engine 其他 64.0ms（6.8%）、`src/engine/realm` 模块加载 31.7ms（3.4%）。

结论（修正计划文档里的先验假设）：

- 冷启动的大头是**realm 模块图的读取与 V8 编译/链接**（约 700ms/944ms），
  **不是** surface 安装 JS（surface 自身 ~67ms）。「18.8 万行 surface 安装是大头」
  不成立。
- 因此 B3（编译缓存）的落点应在 **realm 模块加载路径**（`module-loader` /
  预打包 bundle 的 cachedData），而不是宿主包 ESM。父进程侧 ESM 加载在此
  workload 下约百毫秒级。

复现说明：子进程环境是刻意隔离的（不继承 `NODE_OPTIONS`）。采集子进程 profile
需要临时在 `childEnvironment()` 转发 `NODE_OPTIONS`，并在诊断脚本里结束子进程
stdin 让它干净退出（`close()` 会 `terminate()`，profile 来不及落盘）；或者用
内置的 `EDGE_SANDBOX_CHILD_INSPECT_BRK=<port>` 挂 DevTools 手动 profile。

## 4. 预打包 bundle 对照（Node 22，8 轮中位数）

| backend | 无 bundle 冷启动 | 有 bundle 冷启动 | 无 bundle Realm 创建+销毁 | 有 bundle Realm 创建+销毁 |
|---|---|---|---|---|
| child-process | 775.1 | 526.6 | 810.7 | 514.9 |
| worker-thread | 745.8 | 469.4 | 833.8 | 468.8 |

预打包 `module-bundle.json` 让冷启动下降约 **250–280ms（32%–37%）**，与第 3 节
profile 的判断一致（省掉逐文件读 + 重新编译；bundle 内含 per-module cachedData）。

- 全新克隆（无 bundle）会自动走源文件回退路径，功能等价、冷启动更慢；
  `npm run build:bundle` 生成后即刻受益。
- B3 的 `module.enableCompileCache()` 对宿主 ESM 有效，但对 **realm 模块图**
  （`vm.SourceTextModule` + 自定义 loader）无效；realm 侧的等价物就是该 bundle。

## 5. 复现清单

```bash
npm run benchmark:matrix -- --iterations 8          # 有/无 bundle 均可跑
npm run build:bundle                                # 生成预打包 bundle 后再跑一次
del src\engine\realm\module-bundle.json             # （Windows）回到无 bundle 状态
```

矩阵自动发现 Node 版本：优先 `NVM_HOME`（nvm-windows 布局），其次 `~/.nvm`；
只收集满足 `engines >= 18.18.0` 的版本，也可用 `NV8_NODE_VERSIONS=18.20.8,22.22.2` 指定。
