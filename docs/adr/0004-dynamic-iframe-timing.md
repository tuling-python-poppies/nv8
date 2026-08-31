# ADR-0004：动态 iframe 的 `contentWindow` 时序

- 状态：**待决策**（选项 A 已实现并回滚，回滚原因见下）
- 日期：2026-01
- 依赖：ADR-0001（按需组装）、`docs/node-compatibility.md`

## 背景

行为层对等性检查（`tests/edge-behavior-parity-test.js`）的 14 项跨 Realm 探针
全部不一致，根因是同一个：

```js
const frame = document.createElement('iframe');
document.body.appendChild(frame);
frame.contentWindow            // 真实浏览器: Window    NV8: null
```

实测 NV8 的时序：

| 时刻 | `contentWindow` |
|---|---|
| `appendChild` 返回后同步读 | `null` |
| 一个微任务后 | `null` |
| 一个宏任务后 | `null` |
| 约 265ms 后 | `[object Window]` |

真实浏览器在 `appendChild` 返回时就有初始 about:blank 文档，`contentWindow`
立刻可用；对目标 `src` 的导航才是异步的。

**静态**写在页面 HTML 里的 iframe 没有这个问题——页面构建阶段已经 await 过。

## 为什么这条差异重要

从干净 iframe 里取原生函数、再和主 Realm 对比，是反爬与指纹脚本最常用的手法
之一，而它几乎总是**同步**写的：

```js
const frame = document.createElement('iframe');
document.body.appendChild(frame);
const pristine = frame.contentWindow.Function.prototype.toString;
const patched = pristine.call(navigator.permissions.query) !== ...;
```

`contentWindow` 为 `null` 会让这类脚本立刻抛 `TypeError`。相比"值不对"，
"直接抛错"是更强的信号。

## 根因

子 Realm 创建是异步的，两处都异步：

1. `createRealmShellAsync()` → `moduleLoader.importInternalAsync()`。
   同步 vm module 链接在 Node 18–22 上不可用（见 `docs/node-compatibility.md`），
   所以 bootstrap 必须走异步路径。
2. `navigationSource === 'src'` 时还要 await 一次离线重放取 HTML。

`vm.createContext()` 本身是同步的——**贵的是 bootstrap**，不是上下文创建。
实测一个子 Realm 从插入到就绪 **265ms**，主要花在 337 个 install 调用上。

## 选项

### A. 预热池

页面加载完成后在后台预建 N 个空白子 Realm，插入 iframe 时同步交出一个，
再异步把它导航到目标 URL。

- 优点：全 Node 版本可用；命中时 `contentWindow` 同步可用
- 缺点：
  - 每个池位 **265ms**，池深有限。脚本连续创建 3 个 iframe 就会击穿
  - 池必须计入 `limits.maxRealms`，否则成了绕过资源上限的后门
  - 池要参与沙箱关闭时的清理，否则句柄泄漏
  - **在 load 之前运行的 inline 脚本拿不到池**（池还没填）——而检测脚本
    经常就在 inline 里跑

### B. 同步 bootstrap（仅 Node 24）

宿主支持同步 vm module 链接时走同步路径，否则退回异步。

- 优点：语义最接近真实浏览器，不需要池，无深度限制
- 缺点：
  - **行为随 Node 版本变化**。`NODE_SUPPORT_MATRIX` 里 22/24 是 supported、
    18/20 是 best-effort，所以"降级"有先例；但这条降级会改变**可观测行为**
    而不只是性能，性质不同
  - 同步 bootstrap 会阻塞主线程 265ms，插入 iframe 的那一行变成同步长阻塞

### C. 同步创建裸上下文，惰性 bootstrap

`appendChild` 时同步 `vm.createContext()` 并立即交出，bootstrap 延后。

- 优点：`contentWindow` 非 null，无预热成本
- 缺点：**更糟**。`contentWindow.Array` 会是 `undefined`——脚本拿到一个空壳
  Window，比 `null` 更难诊断，且同样暴露

### D. 接受差异

登记为已知差异，不修。

- 优点：零风险
- 缺点：放着一个高频探测点不管

## 现状

选项未定，差异已登记：`tests/edge-behavior-parity-test.js` 的
`KNOWN_BEHAVIOR_DIFFERENCES` 里 14 条共用同一条理由。另有两条断言把结论钉准，
避免后来者误判范围：

- 静态 iframe 的 `contentWindow` **可用**，且子 Realm 有独立 intrinsics
  → 差异只在**动态创建**
- 动态 iframe 轮询等待后也能建好 → 这是**时序**差距而非功能缺失

## 选项 A 已实现并回滚（实测记录）

按"倾向"一节的判断实现了 A（预热池），**功能上成立，账目上不成立**，已回滚。

### 有效的部分

池把 265ms 挪到关键路径之外后，动态空白 iframe 的表现变正确：

```
windowTag:    [object Window]        （原 [object Null]）
documentTag:  [object HTMLDocument]  （原 [object Null]）
arrayDiffers: true                   （子 Realm intrinsics 独立）
selfRef:      true                   （win.window === win）
toString:     function addEventListener() { [native code] }
```

跨 Realm 探针的 17 个子项里 **12 项转为一致**。

### 回滚原因

**池位与普通子 Realm 在账目上无法区分。** 池位进 `childRealms` 集合、占
realm 额度、计入资源统计，于是所有断言"Realm 数量"与"清理后归零"的测试都会
看到多出来的池位——全量套件 **59 项失败**，包括：

- `Realm resources are released on reset for child-process / worker-thread`
- `Core iframe creates same-origin child Realm and contentDocument`
- `Baseline Core isolates Realm storage and releases Realm handles`

这不是补丁能解决的：要落地必须先设计**独立的池位账目**——池位不算业务
Realm、不占额度、但仍要参与关闭清理。那是一次跨 `runtime-pool` /
`create-realm` / 资源统计三处的改动。

### 还发现两个先行缺陷

实现过程中暴露的，与池无关：

1. **动态创建第 8 个 iframe 时子进程 SIGABRT。** 关掉池同样崩，阈值一致
   （7 个正常、8 个崩）。资源上限没有拦住，而是直接 abort，没有给出
   结构化的容量错误。
2. **iframe 的父子链与 URL 有四处不符**，静态 iframe 也一样：
   `contentWindow.parent === window` 为 false、`top` 同样、
   `frameElement` 恒为 `null`（`window-state-globals-runtime.js` 里硬编码）、
   空白 iframe 的 `location.href` 是父页面 URL 而非 `about:blank`。

第 2 条说明"接上池"只是第一步——即使 `contentWindow` 可用了，父子链仍然
对不上。

## 倾向

倾向 **A + B 组合**：Node 24 上走同步 bootstrap（B），其余版本用预热池（A）
兜底。但这个组合会让两条代码路径都要维护，且行为在版本间不一致——需要先回答：

1. NV8 是否接受"可观测行为随 Node 版本变化"？现有降级都只影响性能与可用性，
   不影响行为。
2. 若接受 A，池深多少？`maxRealms` 默认 64，池占 2 个是否可接受？
3. 265ms 的同步阻塞（B）是否可接受？真实浏览器这一步是微秒级。

在回答之前不动手——这是架构决策，不是补丁。

## 附：复现

```
npm run fingerprint:behavior     # 采集真实 Edge 的 14 项跨 Realm 结果
node --experimental-vm-modules --test tests/edge-behavior-parity-test.js
```

时序数据由 `tests/edge-behavior-parity-test.js` 里
`the dynamic-iframe gap is a timing gap, not a missing feature` 一项持续验证。
