# ADR-0004：动态 iframe 的 `contentWindow` 时序

- 状态：**已定案 —— 选 A（opt-in 预热池，默认关闭）**，见「决定」与「落地记录」
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

## 决定：A，但按 Profile opt-in、预热「已激活的 Realm」、默认关闭

原倾向是 **A + B 组合**（Node 24 走同步 bootstrap，其余版本用池兜底），并列了三个
待回答问题。定案时把这三个问题都用实测回答了，结论是**放弃 B**。

### 先把 254ms 拆开

仓库里本来就有「异步准备 + 同步激活」的机制（`createRealmShellAsync` /
`activateRealmShell`），根 Realm 一直在用。实测两段耗时：

```
createRealmShellAsync  (异步：模块图加载+链接)   median 148ms
activateRealmShell     (同步：337 个 install)    median 106ms
                                          合计   254ms
```

这决定了池该预热什么：

- **预热 shell** → `appendChild` 里仍要同步跑 `activateRealmShell`，阻塞 **106ms**
- **预热已激活的 Realm** → `appendChild` 零同步开销，254ms 全部前移到 `create()`

必须选后者。真实浏览器建初始 about:blank 文档是**微秒级**——`appendChild` 里同步卡
106ms 本身就是一个浏览器没有的时序特征，任何围绕 iframe 创建做 `performance.now()`
差值、或观察 RAF/timer 节奏的代码都能看到这个停顿。**用一个可检测特征去修另一个
可检测特征，不值。**

同一个理由否掉 **B**：它的 106ms 同步阻塞是同一个问题；而且「可观测行为随 Node
版本变化」与刚做完的四档 surface 逐字节对齐方向相反（node18/20/22 对
`SuppressedError` / `DisposableStack` / `Float16Array` / `DataView` 的记录已经与
node24 完全相同）。

### 三个问题的答案

1. **是否接受可观测行为随 Node 版本变化？** 不接受。四档 surface 刚统一，
   不能反手在行为层分叉。
2. **池深多少？** 由调用方定，默认 **0**，上限 8。池位是真实的 Realm、占真实的堆，
   512MB 默认堆实测只装得下 11 个子 Realm（见 `heapSafeRealmLimitFor`），
   池深超过个位数等于把额度全给了预热。
3. **106ms 同步阻塞是否可接受？** 不可接受，所以不走 shell 方案。

### 为什么 opt-in 不是妥协

原 ADR 卡在「是否接受冷启动翻倍」上。这个问题在逆向场景里是**假问题**：NV8 不是
通用浏览器，每个目标本来就有自己的 Profile / evidence bundle / replay 清单，
**按目标配置是这个项目的常态**。谁的目标用了那套 iframe 写法，谁付冷启动的钱。

默认关闭还直接解决了上次回滚的根因：那次池永远开着，池位与业务 Realm 在账目上
无法区分，全量套件 **59 项红**。默认 0 意味着现有测试看到零个池位，账目完全不变
——实测 777 项在四档全绿，**默认路径一项都没动**。

### 池位账目

池位**同时**在 `childRealms` 里：它们是真实的 Realm，占真实的堆，所以必须参与
容量守卫与关闭清理。把它们排除在额度之外会重犯「守卫的算术与现实不符」那个错
（那个错刚在 `heapSafeRealmLimitFor` 里修掉——原公式放行数超过堆能装下的数量，
溢出是 SIGABRT）。

`readResources()` 增加 `idlePrewarmedRealms`，于是「当前有几个业务 Realm」
= `childRealms - idlePrewarmedRealms`，仍然答得出来。

### 顺带纠正选项 C 的一处事实错误

原文说选项 C（同步建裸上下文）会让 `contentWindow.Array` 是 `undefined`。
**这是错的**——`vm.createContext()` 免费提供全部 JS intrinsics，缺的是 DOM/Window
表面。所以对 `f.contentWindow.Function.prototype.toString` 这个具体写法，裸上下文
其实能用。

C 仍然要拒，但理由要换：`contentWindow.document === undefined` 比
`contentWindow === null` 是**更强**的信号，而且「一个 Window 的表面随时间长出来」
是任何浏览器都没有的状态。

## 落地记录

- `limits.prewarmChildRealms`（0–8，默认 **0**）
- 池在 `initialize()` 里、**根 Realm 之前**填满。必须如此：页面脚本在
  `bootstrapRoot()` 内部就执行了（`parsePageHTML()`），根 Realm 一返回它们已经跑完。
  原 ADR 记的「池在 load 之后才填满，inline 脚本拿不到」正是这个问题
- 池位以「自己是顶层」的状态引导（那时根 Realm 还不存在，没有 `parentWindow`
  可传），被领走时由 `bootstrap-root.js` 新增的 `reparentRealm()` 补上父子关系。
  走 bootstrap 命名空间而不是 `importUrlSyncCached()`：bootstrap 模块本来就已加载，
  不需要额外 preload，在 Node 18–22 上也不依赖同步模块链接
- `createChildRealm()` 命中池时**同步**返回 handle，未命中返回 promise；
  `html-iframe-element-realm-state.js` 两种都处理。`load` 仍异步派发——真实浏览器
  把它排成任务，同步派发会让 `addEventListener('load')` 在注册前就错过
- 只有**空白**（既无 `src` 也无 `srcdoc`）且**同源**且 URL 等于父页面的 iframe 能
  领池位：池位的文档是空白骨架，带 src/srcdoc 的需要不同文档，重建文档和新建一个
  Realm 没有区别
- 填池失败**静默放弃**剩余池位：预热是优化不是功能，让它把沙箱创建带崩等于把一个
  可选加速做成新的失败点

开启 `prewarmChildRealms: 1` 后实测：

```
syncContentWindow    true
windowTag            [object Window]
documentTag          [object HTMLDocument]
arrayDiffers         true        （池位有独立 intrinsics）
selfRef              true
parentIsWindow       true        ← 靠 ADR-0007
topIsWindow          true        ← 靠 ADR-0007
frameElementMatches  true        ← 靠 frameElement 那一轮
nativeToString       function addEventListener() { [native code] }
```

`realm/identity-bundle` 的 16 个子项现在与真实 Edge 151 **逐字相同**（唯一不含的是
`href`：空白 iframe 的 `location.href` 仍是父页面 URL 而非 `about:blank`，那是独立
的 origin/URL 解耦改造）。这验证了排序判断——ADR-0007 与 `frameElement` 必须先做，
否则池落地了那条经典探针照样过不去。

测试 8 项（`tests/iframe-prewarm-pool-test.js`）。777 项在 Node 18/20/22/24 四档全绿。

## 残留

- **池深 N 只覆盖建 ≤N 个 iframe 的目标**，超出退回原行为。这是缓解不是根治，
  有专门断言把它写死——以为「iframe 已经修好了」比知道自己在赌更危险
- 默认配置（0）下 `contentWindow` 仍同步为 `null`，
  `edge-behavior-parity-test.js` 的两条登记差异保持不变
- 空白 iframe 的 `location.href`：独立立项

## 附：复现

```
npm run fingerprint:behavior     # 采集真实 Edge 的 14 项跨 Realm 结果
node --experimental-vm-modules --test tests/edge-behavior-parity-test.js
```

时序数据由 `tests/edge-behavior-parity-test.js` 里
`the dynamic-iframe gap is a timing gap, not a missing feature` 一项持续验证。
