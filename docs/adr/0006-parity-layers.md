# ADR-0006：对等性检查分三层，各层职责不重叠

- 状态：已接受
- 日期：2026-01
- 依赖：ADR-0005

## 背景

「NV8 像不像真实浏览器」不是一个可以一次性回答的问题。早期只有 Baseline
（与自己上一次录制对比），它抓重构回归很好，但抓不到「从一开始就和真实浏览器
不一样」——因为参照物是 NV8 自己。

加了与真实 Edge 的对比之后，又出现新问题：一份大而全的对比会同时报出
「少了个全局」和「报错文案差一个句点」，量级差太远，看的人只会挑大的看。

## 决策

分三层，**各层参照物与产出都不同**：

| 层 | 参照物 | 抓什么 | 现状 |
|---|---|---|---|
| Baseline | NV8 上一次录制 | 重构引入的回归 | 3 套 fixture |
| 形状对等 | 真实 Edge 的名字与 descriptor | 存在性、descriptor 形状 | 全局 99.68%、成员 963/966 |
| 行为对等 | 真实 Edge 的运行结果 | 同一段代码跑出什么 | 116 探针 / 12 类 |

三层互补，不能互相替代。**证据**：`CSSStyleDeclaration` 在形状层报 0 差异
（双方原型都只有 10 个成员，CSS 属性是实例自有属性），而行为层挖出 6 处不一致
——未设置属性读 `undefined` 而非 `""`、赋值不同步 `cssText`、computed style
可写。形状层永远看不到这个洞。

## 各层的设计约束

### 形状层：多出比缺少更严重

- **多出**（NV8 有、Edge 没有）：宿主特征泄漏，硬断言必须为 0
- **缺少**（Edge 有、NV8 没有）：功能缺口，必须登记理由，数量上限只允许下调

已抓到 4 处泄漏：`AsyncIterator`（Node 24 的 V8 特性）、`webkitAudioContext`
（Edge 151 已移除）、`NetworkInformation.prototype.type`（只在 Android）、
`Event.prototype.isTrusted`（应在实例上且 `configurable: false`）。

### 行为层：探针准入三条

1. **跨运行确定** —— 采集时跑两轮并要求逐字一致，探针本身在抖就直接失败
2. **与机器无关** —— 见 ADR-0005
3. **可序列化** —— 结果要能进 JSON 逐字比较

因此探针只取引擎固定产出的结构性事实：报错文案、`toString` 形态、类型标签、
非法接收者行为、事件阶段。刻意**不取** `measureText` 字形宽度（取决于已安装
字体）与 `width`/`height`（取决于视口与排版）。

排除哪些属性靠**差分实测**而不是手写名单：同页面在两种视口下采集 + 同视口下
两种内容量对比，两组并集即不可建模项。只做第一组会漏掉 `height`——空元素在
两种视口下都是 0px。

### 探针定义必须共享

采集脚本与测试导入**同一份** `src/baseline/behavior-probes.js`。各写一份必然
漂移，漂移后比较就没有意义。

## 登记表机制

三类清单，各有用途：

| 清单 | 用途 |
|---|---|
| `KNOWN_MISSING_*` | 有对比、确实缺、写明原因 |
| `KNOWN_BEHAVIOR_DIFFERENCES` | 有探针、结果不一致、写明原因 |
| `UNPROBED_KNOWN_GAPS` | 明知不一致但**刻意不写探针**（写了必然红） |

每类都配「陈旧条目检查」：登记了但其实已经一致的条目会让测试失败。

**这条机制真的抓到过东西**：把成员对比基准从 150 profile 改成 151 后，
陈旧检查立刻揪出 4 条假缺口——`AnimationEvent.animation`、
`TransitionEvent.animation`、`PerformanceEntry.navigationId`、
`WheelEvent.momentum` 早就实现了，只是被 `edge151Surface` 门控。

## 已知的方法论陷阱

写在这里，因为都不是一次就想对的：

1. **采集基准版本必须与 profile 对齐**。拿 Edge 151 的 fixture 比 150 profile，
   凡是版本门控的成员都会被误报成缺口。踩了两次。
2. **探针必须逐用例隔离**。把 beforeunload 三条路径顺序跑在同一沙箱里，
   前一个 `preventDefault` 监听器没移除，导致后两条看起来都能取消。
3. **不能按名字一刀切**。按裸方法名排除 `forEach`，实测只有
   `DOMTokenList.forEach` 是 JS 风格报错，`URLSearchParams.forEach` 与
   `Headers.forEach` 反而走 WebIDL 模板。
4. **间歇失败要查根因**。三次把套件 flaky 归为"资源竞争"放过，第四次拿到真实
   错误才发现是测试把断言绑在了 `limits.timeoutMs` 的生产安全上限上——本质是
   赌执行时长，和固定 sleep 同类。

## 相关实现

- `tests/edge-surface-parity-test.js`(8) / `edge-member-parity-test.js`(9)
- `tests/edge-behavior-parity-test.js`(24) / `webgl-parity-test.js`(8)
- `src/baseline/behavior-probes.js` —— 探针定义，采集与测试共用
- `docs/edge-parity.md` —— 三层现状与采集命令
