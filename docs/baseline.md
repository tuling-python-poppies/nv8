# Baseline 验收

Baseline 的作用是让**行为变化必须被解释**。如果每次差异就直接更新 fixture，
它就退化成记录当前行为的日志，失去守门意义。

## 两层 surface 快照

| 快照 | 覆盖 | 用途 |
|------|------|------|
| `src/infra/baseline/surface.js` | 精选 24 全局 + 10 原型 | 快速冒烟 |
| `src/infra/baseline/full-surface.js` | 全部全局 own key + 各自原型成员 | 默认模式切换的前置验收 |

分两层的原因：精选快照跑得快，适合每次提交；完整快照会暴露真实覆盖差距，
适合作为门禁。

## 完整快照揭示的事实

先前的精选 24 全局快照显示 legacy 与 plugin 的成员数只差 11（520 vs 509），
看起来两条路径已经很接近。

完整枚举后的真实数字：

| 路径 | 全局数 | 原型成员数 |
|------|--------|-----------|
| legacy | 1234 | 8910 |
| plugin | 149 | 1671 |

差距是一个数量级。精选快照恰好只覆盖了两条路径都已实现的那部分，把差距
完全掩盖了。这条差异已登记为 `blocking`，是切换默认模式的硬门槛。

## 存储策略

fixture 只存**分组摘要**，且每个全局压成一行紧凑字符串：

```
"AbortController": "function:3:1:66f6b013dd7639e6"
                    ↑type    ↑成员 ↑symbol ↑digest16
```

两个好处：

- **体积**。legacy 有 1234 个全局，展开成对象后四档 fixture 超过 1MB；
  紧凑格式压到 332KB。
- **diff 可读性**。一个全局变化只影响一行，评审时直接看出改了什么。

digest 截断到 16 hex（64 bit）。用途是检测意外变化而非防篡改，这个强度远超需要。

需要逐条明细时用：

```
node --experimental-vm-modules scripts/capture-full-surface.mjs --full
```

## 按 Node major 逐档

fixture 按**每个 Node major 单独一档**，而不是粗分「新/旧」两档。

我最初按 `node22plus` / `node18to20` 分两档，在 Node 18 上跑校验时立刻报错——
18 和 20 的 V8 语言内建也不同：

| 原型 | Node 18 | Node 20 | Node 22 | Node 24 |
|------|---------|---------|---------|---------|
| `Array.prototype` | 36 | 40 | 40 | 40 |
| `ArrayBuffer.prototype` | 3 | 6 | 9 | 9 |
| `String.prototype` | 50 | 52 | 52 | 52 |
| `SharedArrayBuffer.prototype` | 3 | 6 | 6 | 6 |
| `RegExp.prototype` | 14 | 15 | 15 | 15 |

具体来源：`toSorted`/`toReversed`/`toSpliced`/`with` 与 `isWellFormed`/
`toWellFormed` 需要 Node 20；`ArrayBuffer.prototype.resize` 需要 20，
`transfer`/`detached` 需要 22。

合并任意两个 major 都会误报，所以改为逐档。四档实测数据：

| 档 | legacy 全局/成员 | plugin 全局/成员 |
|----|-----------------|-----------------|
| node18 | 1233 / 8875 | 144 / 1615 |
| node20 | 1233 / 8885 | 144 / 1628 |
| node22 | 1234 / 8907 | 145 / 1650 |
| node24 | 1234 / 8910 | 149 / 1671 |

四个版本各自校验均通过。某档缺失时脚本明确提示先运行 `--write`，
而不是拿别档数据误比。

## 差异清单

`src/infra/baseline/known-differences.js`。每条必须有四个字段：

| 字段 | 含义 |
|------|------|
| `owner` | 谁负责收敛或维护这条差异 |
| `severity` | `blocking` / `tracked` / `environmental` |
| `reason` | 为什么存在 |
| `expectation` | 期望的最终状态 |

严重级别语义：

- `blocking` — 阻塞默认模式从 legacy 切到 plugin
- `tracked` — 已知可接受，但需要收敛
- `environmental` — 宿主环境造成，NV8 无法消除

当前登记：

| id | 级别 | owner |
|----|------|-------|
| `surface-coverage-gap` | blocking | plugin-migration |
| `reset-storage-retention` | tracked | plugin-migration |
| `inspect-availability` | tracked | core-runtime |
| `Iterator`（Node 依赖） | environmental | core-runtime |

`validateDifferenceRegistry()` 校验清单自身：字段缺失、id 重复、severity
非法都会让测试失败。这防止有人加一条空壳条目来绕过门禁。

## 使用

```
npm run baseline:surface              # 校验，有差异则非零退出
node --experimental-vm-modules scripts/capture-full-surface.mjs --write   # 更新 fixture
node --experimental-vm-modules scripts/capture-full-surface.mjs --full    # 导出明细
```

校验时 Node 版本造成的缺失会被自动豁免（查 `expectedMissingForNode()`），
其余缺失、新增和变更都会报错并提示：

> 差异必须先解释：登记到 `src/infra/baseline/known-differences.js`，
> 或确认是预期变更后运行 `--write` 更新 fixture。

## 采集实现的两个约束

**不触发 getter。** 用 `Object.getOwnPropertyDescriptor` 而非取值，避免采集
过程本身改变运行时状态。

**Symbol key 只计数不展开。** well-known symbol 的枚举顺序在不同引擎/版本
间不稳定，展开会引入无意义的抖动。改为记录数量，数量变化仍能被发现。

采集深度固定为「全局 + 其 prototype 成员」两层，不递归。递归会让快照体积
失控，而两层已足够发现绝大多数 surface 回归。

## 一个采集期踩到的限制

legacy 公共 sandbox 默认 `maxOutputBytes` 为 1MB，全量快照约 240KB 本应够用，
但实际会超——因为 `sandbox.run()` 的返回值在传输前还有编码开销。采集脚本里
显式放宽到 8MB。这是采集工具而非运行时，放宽是合理的；运行时限额不受影响。

## 测试

```
tests/baseline-full-surface-test.js   11 项
```

包含：差异清单自洽性、Node 版本豁免解析、blocking 项显式暴露、fixture 分档
存在性与 schema、实时采集与 fixture 对比（legacy + plugin）、重复采集的
确定性、`diffFullSurface` 的三类差异分离。

## bootstrap 安装顺序

三个 bootstrap 的完整调用序列都已入 fixture：

| bootstrap | 步数 | 首 → 末 |
|-----------|------|---------|
| root | 340 | `hideNodeGlobals` → `finalizeWindowSurfaceOrder` |
| worker | 109 | `hideNodeGlobals` → `finalizeWorkerSurfaceOrder` |
| worklet | 13 | `hideNodeGlobals` → `installRegistration` |

### 存完整序列而非只存摘要

旧 fixture 只有 `callSequenceSha256`。序列一变只能得到「digest 不一致」，
无法知道是哪一步。现在存完整序列（每步一条 `kind:name`），
`diffBootstrapSequence()` 能报出具体差异。

自证：把 worklet 里两个相邻安装调用互换，校验立刻定位到位置：

```
worklet: 安装顺序变化
  位序 2: 期望 install:installNativeFunctionToString，实际 install:installErrorStackGuard
  位序 3: 期望 install:installErrorStackGuard，实际 install:installNativeFunctionToString
```

### diff 分三类

| 类别 | 含义 |
|------|------|
| `removed` | 安装步骤消失，最可疑 |
| `added` | 新增步骤，通常有意但需确认 |
| `reordered` | 集合相同、顺序变了，最容易被忽略的回归 |

`reordered` 只在集合完全一致时才计算。否则一次增删会让后续全部位置偏移，
几百条「位序差异」会淹没真正的信号。

重复调用按次数比对而非去重——两次调用变一次是真实的行为变化。

### 源码指纹降为信息性字段

`sourceSha256` 和函数起止行号移到 `informational` 段，**不参与校验**。

理由：它们对任何注释改动、代码位移都敏感。我在前面做状态迁移时就撞到过——
只改了一行 `configureStorage()` 调用，baseline 就失败，而失败信息完全无助于
判断安装行为是否真的变了。baseline 要守的是**安装顺序**，不是文件字节。

有一条测试断言这些字段不出现在顶层，防止被重新拉进校验。

另有一条测试交叉校验 `callCount`/`firstCall`/`lastCall` 与 `sequence` 一致，
防止手改 fixture 时只动摘要不动序列。

## Trace / Network / Navigation golden fixture

这三类记录都带非确定性成分，直接存 golden 会每次都不一致。核心工作是归一化。

判断标准：**如果某字段在同一场景重复运行时会变，它就不属于行为契约。**

| 剔除的字段 | 原因 |
|-----------|------|
| `sequence` | 自增序号，随之前执行过多少操作漂移 |
| trace 的 `arguments` 值 | 可能含 URL、随机数、对象地址；只保留类型序列 |
| `*Truncated` 标志 | 取决于限额配置而非行为 |
| `bodyText` / `bodyBase64` | 可能含 nonce；只保留 `bodyByteLength` |
| navigation 的 `key` / `id` | 自增标识 |

header 名归一化为小写并排序，避免顺序抖动。navigation 的 `state` 降级为
`hasState` 布尔。

当前 golden：

```
trace:      33 entries
requests:    1 entry   (outcome: replayed)
navigation:  2 entries (初始条目 + 一次 pushState)
```

连续三次采集结果一致。

### diff 定位到条目

`diffObservability()` 逐条对比而非只比 digest，差异会指出 section、索引和
前后值：

```
requests[0]:
  期望 {"api":"fetch","method":"GET",...}
  实际 {"api":"fetch","method":"POST",...}
```

### 两条防线

一条测试断言 fixture 里不含 `sequence`、`bodyText`、`bodyBase64`、
`Truncated`、`key`、`id` 等字段——防止归一化被绕过或退化。

另一条断言 `requests[0].outcome === 'replayed'`，即 baseline 场景**永远不
触达真实网络**。这既是行为契约也是安全约束。

## 使用

```
npm run baseline              # 三项全跑
npm run baseline:bootstrap    # 安装顺序
npm run baseline:surface      # 完整 surface
npm run baseline:observability # trace / network / navigation
```
