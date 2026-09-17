# 编译缓存实验（B3）

> 日期：2026-09-17 · 主机：Windows（本机） · 无 `module-bundle.json`（全新克隆状态）
> 结论先行：**不启用**。Node 22/24 上 `NODE_COMPILE_CACHE` 对 nv8 的宿主包加载
> 是系统性负收益（+29～+41ms 中位数），端到端冷启动同样无收益；Node 18/20 压根没有该 API。
> realm 侧（真正的冷启动大头）也不受它影响——等价物是预打包 bundle（见
> [`backend-benchmark.md`](backend-benchmark.md) 第 3/4 节）。

## 1. 支持矩阵

| Node | `module.enableCompileCache` | `NODE_COMPILE_CACHE` 环境变量 |
|---|---|---|
| 18.20.8 | **无**（undefined） | 不支持 |
| 20.20.2 | **无**（undefined） | 不支持 |
| 22.22.2 | 有 | 生效（加载 barrel 写入 1744 个缓存项） |
| 24.11.0 | 有 | 生效 |

四档均实测（`node -e "typeof require('module').enableCompileCache"`）。18/20 想用只能改
启动方式（如外部编译缓存工具链），已超出本次实验范围。

## 2. 宿主包加载（`import(src/index.js)`，即 `nv8` 入口 barrel）

方法：独立子进程逐次 import，测量动态 import 的墙钟；缓存目录清空后先跑一次
（填充），随后交错 A/B（plain / cached 交替，消除系统漂移），12 对。

| Node | plain 中位数 / p90 | cached 中位数 / p90 | 配对差值中位数（正=缓存更慢） |
|---|---|---|---|
| 22.22.2 | 530.1 / 540.9 ms | 553.6 / 567.9 ms | **+29.4 ms**（12/12 为正，区间 +12.9～+46.2） |
| 24.11.0 | 487.6 / 510.5 ms | 513.8 / 549.2 ms | **+41.4 ms**（10/12 为正） |

首次运行（缓存填充）成本：Node 22 约 629ms（比 plain 中位数还慢约 100ms）、
Node 24 约 529ms（约等于 plain 中位数）。

缓存命中已验证：`NODE_DEBUG_NATIVE=COMPILE_CACHE` 输出
`reading cache from … success, size=…` + `cache … was accepted, keeping the in-memory entry`。
即**不是缓存没生效，而是命中本身也要付出逐模块读缓存/校验的成本**（4025 个小模块，
每个源的 V8 编译本来就便宜；OS 文件缓存已把源文件读热了）。

## 3. 端到端冷启动（EdgeSandbox create → 首次 run）

方法：`scripts/benchmark.mjs --iterations 8 --backend child-process`，同一份代码，
带/不带 `NODE_COMPILE_CACHE` 各一遍（Node 22，8 轮中位数）。

| 条件 | 冷启动中位数 / p90 |
|---|---|
| 无缓存 | 788.9 / 814.7 ms |
| 有缓存（含首次填充那一轮） | 802.6 / 832.1 ms |

差值与第 2 节的宿主侧回归一致（约 +14ms），无正收益。子进程不继承
`NODE_COMPILE_CACHE`（`childEnvironment()` 是刻意最小化的），因此端到端里只有
父进程的宿主图加载受缓存影响——而它本来就是冷启动的小头（见 B2 profile：
父进程 4046ms 采样里 3951ms 是 idle）。

## 4. 结论与边界

- **不在 nv8 启用编译缓存**：无收益、有轻微负收益，且要额外管理缓存目录；
  Node 18/20 不可用会让行为按版本分叉。
- **realm 模块图（冷启动大头）不归它管**：realm 用 `vm.SourceTextModule` +
  自定义 loader，`module.enableCompileCache()` 只覆盖 Node 自身的 ESM/CJS 图。
  预打包 bundle 才是 realm 侧的等价物，且实测有效（冷启动 −250～−280ms）。
- **边界**：结论建立在本机的 4025 个小模块、OS 文件缓存热的工作负载上；
  若未来引入少量超大模块（编译成本远大于读缓存成本），可在目标负载上重新测。
  届时优先用独立启动器（`node --import <loader>`）启用，而不是写进
  `src/public/create-sandbox.js` 内部。

## 5. 复现

```bash
# 支持矩阵
node -e "console.log(typeof require('module').enableCompileCache)"

# 宿主加载 A/B（清空缓存目录 → 先跑一次填充 → 交错 N 对）
set NODE_COMPILE_CACHE=<目录>
node --experimental-vm-modules -e "await import('<repo>/src/index.js')"
set NODE_DEBUG_NATIVE=COMPILE_CACHE   # 验证命中：success / accepted

# 端到端
node scripts/benchmark.mjs --iterations 8 --backend child-process --json
```
