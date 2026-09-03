# NV8

一个零依赖的 Node.js 浏览器运行时模拟与 Web 采集框架。

NV8 在 Node 进程里重建一个与真实 Microsoft Edge 无法区分的 JavaScript 执行环境，
用来运行目标站点的前端代码，从中恢复请求签名、令牌与协议行为；同时提供一套完整的
采集调度层，把恢复出来的协议变成可持续运行的数据采集。

**这是一个私有框架，没有公开发布计划。**

---

## 目录

- [定位：它解决什么问题](#定位它解决什么问题)
- [不做什么](#不做什么)
- [快速开始](#快速开始)
- [两条使用路径](#两条使用路径)
- [浏览器运行时](#浏览器运行时)
- [三层对齐](#三层对齐)
- [采集层](#采集层)
- [Profile 与插件](#profile-与插件)
- [Evidence 与离线回放](#evidence-与离线回放)
- [进程后端与资源上限](#进程后端与资源上限)
- [指纹采集脚本](#指纹采集脚本)
- [测试](#测试)
- [命令一览](#命令一览)
- [目录结构](#目录结构)
- [设计原则](#设计原则)
- [已知边界](#已知边界)

---

## 定位：它解决什么问题

做 Web 协议逆向时，真正的困难通常不在算法，而在**环境**。

目标站点的签名逻辑跑在浏览器里，会读 `navigator`、`screen`、`document`、
`CanvasRenderingContext2D`、`WebGLRenderingContext`，会检查
`Function.prototype.toString` 是不是 `[native code]`，会数 `arguments.length`
在参数不足时抛出的错误消息，会比对 `Object.keys(window)` 的枚举顺序。这些代码在
Node 里直接跑必然失败；在真实浏览器里跑则很难规模化、难以自动化、难以持续运行。

常见的三条路和它们的代价：

| 方案 | 代价 |
|---|---|
| 真实浏览器 + 自动化（Puppeteer/CDP） | 资源重、易被检测、CDP 本身就是特征 |
| 抠出 JS 片段用 jsdom 跑 | 环境残缺，稍微认真的检测立刻发现 |
| 纯手工翻译成 Python/Go | 一次性成本极高，目标一改就重做 |

NV8 走第四条：**在 Node 里把浏览器环境补到「检测不出来」的程度，然后原样运行目标
的原始脚本。** 不翻译、不改写、不注入痕迹。

补到什么程度是可以量化的，见[三层对齐](#三层对齐)。

协议恢复出来之后，采集本身还有一整套工程问题——分页、限流、熔断、代理轮换、
断点续采、去重落库。NV8 的[采集层](#采集层)把这些做完了，所以从「跑通一次签名」
到「稳定跑一个月」之间不需要另起一个项目。

---

## 不做什么

划清边界比列举功能更重要：

- **不做浏览器自动化。** 不点击、不截图、不等元素出现。需要真实渲染请用别的工具。
- **不做渲染与布局。** 没有排版引擎，所以 `offsetWidth`、`getBoundingClientRect`
  这类依赖真实布局的值不可信（NV8 对这类属性返回空串而不是编造数字，见
  [已知边界](#已知边界)）。
- **运行时不联网。** 运行目标脚本时，所有网络访问走离线回放；回放未命中就在本地
  失败，**绝不回落真实网络**。真实网络只属于采集层。
- **不内置数据库驱动。** 采集结果落地定义为接口，附内存与 NDJSON 两个实现，
  接 Postgres/SQLite 由调用方提供。
- **不猜业务语义。** 分页游标怎么取、条目主键是哪个字段，都必须由调用方指定。
  猜错的代价是静默少采或静默丢数据，比报错严重得多。

---

## 快速开始

### 环境要求

- Node.js **>= 18.18.0**（在 18/20/22/24 上均有测试；推荐 24）
- 必须带 `--experimental-vm-modules` 启动（所有 Node 版本都需要）
- 零运行时依赖，`npm install` 不装任何包

### 跑一段脚本

```js
import { EdgeSandbox } from './src/public/edge-sandbox.js';

const sandbox = await EdgeSandbox.create({
  page: {
    url: 'https://example.com/list',
    html: '<div id="app">hello</div>',
  },
  limits: { timeoutMs: 5000 },
});

console.log((await sandbox.evaluate('navigator.userAgent')).value);
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
// (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0

console.log((await sandbox.evaluate('document.getElementById("app").textContent')).value);
// hello

console.log((await sandbox.evaluate('location.href')).value);
// https://example.com/list

console.log((await sandbox.evaluate('getComputedStyle(document.body).display')).value);
// block

// 关键的一条：原生函数伪装
console.log((await sandbox.evaluate(
  'Function.prototype.toString.call(document.addEventListener)'
)).value);
// function addEventListener() { [native code] }

await sandbox.close();
```

运行：

```bash
node --experimental-vm-modules your-script.mjs
```

### 采集一个分页接口

```js
import { Collector } from './src/collector/collector.js';
import { createPaginationScheduler } from './src/collector/pagination.js';
import { createNdjsonResultSink } from './src/collector/result-sink.js';
import { createMemoryCheckpointStore } from './src/collector/checkpoint.js';

const collector = new Collector({
  policy: { allowedOrigins: ['https://api.example.com'] },
  rateLimit: { requestsPerSecond: 5, burst: 10, maxConcurrent: 3 },
  circuitBreaker: { failureThreshold: 5, resetTimeoutMs: 30_000 },
});

const sink = createNdjsonResultSink({
  filePath: './out/items.ndjson',
  keyOf: (item) => item.id,          // 去重主键，必须由你指定
});

const scheduler = createPaginationScheduler({
  collector,
  // 「下一个请求是什么」只能你自己回答
  nextRequest: ({ index, previous, resumeContext }) => {
    const cursor = previous
      ? previous.response.body.next
      : (resumeContext?.cursor ?? null);
    if (index === 0 && cursor === null) {
      return { url: 'https://api.example.com/items', method: 'GET' };
    }
    return cursor ? { url: `https://api.example.com/items?cursor=${cursor}`, method: 'GET' } : null;
  },
  extractItems: (result) => result.response.body.items,
  checkpoint: {
    store: createMemoryCheckpointStore(),
    jobId: 'items',
    job: { target: 'items', query: {} },   // 指纹，查询变了就不会错续
    contextOf: (page) => ({ cursor: page.response.body.next }),
  },
  limits: { maxPages: 500, maxEmptyPages: 2 },
});

for await (const page of scheduler.pages()) {
  if (page.stop !== null) {
    console.log('结束：', page.stop.reason, page.stop.totalItems);
    break;
  }
  await sink.write(page.items);
}
await sink.close();
```

---

## 两条使用路径

NV8 有两个入口，对应两种心智模型。

### `EdgeSandbox`（推荐用于协议恢复）

面向「我要跑一段目标站点的脚本」。开箱即用，默认装配完整的 Edge 表面。

```js
const sandbox = await EdgeSandbox.create(options);
```

主要方法：

| 方法 | 用途 |
|---|---|
| `evaluate(source)` | 执行一段脚本，返回结构化结果 |
| `batchEvaluate(sources)` | 批量执行，共享同一个 Realm |
| `evaluateModule(source, url)` | 以 ES 模块方式执行 |
| `setPage(page)` | 更换页面（URL / HTML / Cookie） |
| `networkRequests()` | 取出脚本发起过的所有请求（协议恢复的主要产出） |
| `enableTrace()` / `trace()` | 记录属性访问与函数调用，用于定位签名入口 |
| `resources()` | 当前 Realm / Worker / 定时器等资源占用 |
| `close()` | 关闭，幂等 |

### `createNv8`（面向可裁剪装配）

面向「我只要 DOM 不要 WebGL」这类需求，按插件与 Profile 组合运行时。

```js
import { createNv8 } from './src/index.js';

const nv8 = await createNv8({
  runtimeMode: 'plugin',
  profile: 'minimal-fetch',
  limits: { timeoutMs: 3000 },
});
```

两者可以共存。`runtimeMode` 默认是 `legacy`（完整装配，覆盖面最广）；
`plugin` 模式覆盖面较小，按需拉取——这是有意为之的决策，见
[ADR-0001](docs/adr/0001-plugin-surface-coverage.md)。

---

## 浏览器运行时

### 已实现的表面

大类如下（完整清单见 [docs/edge-parity.md](docs/edge-parity.md)）：

- **DOM**：Node / Element / Document / 集合类 / 选择器引擎 / MutationObserver
- **HTML 元素**：脚本、iframe、canvas、媒体、表单等
- **事件**：EventTarget 完整分发、捕获/冒泡、`onxxx` 处理器属性、Trusted 语义
- **页面生命周期**：流式解析、`async`/`defer` 顺序、DOMContentLoaded / load /
  beforeunload / pagehide / unload，`document.write` 与 `document.open` 语义
- **CSSOM**：`CSSStyleDeclaration`（745 个属性以**实例属性**形式安装）、
  UA 默认样式表、计算值
- **网络类**：fetch / XHR / WebSocket / EventSource（均走离线回放）
- **存储**：localStorage / sessionStorage / IndexedDB / Cookie
- **Worker 家族**：Worker / SharedWorker / ServiceWorker（含完整生命周期与
  客户端模型）/ Worklet
- **iframe**：子 Realm、跨 Realm 消息、隔离
- **图形与设备**：Canvas 2D、WebGL（masked/unmasked 分离）、WebGPU 表面、
  设备类 API
- **加密**：SubtleCrypto、哈希、随机
- **其他**：Performance、Intl、URL、Streams、AbortController、Trusted Types 等

### 隔离与执行

每个 sandbox 在独立子进程（或 worker 线程）里跑，页面脚本运行在
`vm.createContext()` 建立的 Realm 中。宿主的 `process`、`require`、
`Buffer` 等一律不可见：

```js
await sandbox.evaluate('typeof process');   // "undefined"
await sandbox.evaluate('typeof require');   // "undefined"
```

`iframe` 与 Worker 各自获得独立的子 Realm，跨 Realm 只能通过消息通道通信。

---

## 三层对齐

「像浏览器」不是形容词，是可以逐层测量的。NV8 把它拆成三层，
**每层职责不重叠、互相不能替代**（[ADR-0006](docs/adr/0006-parity-layers.md)）。

### 第一层：全局名存在性

真实 Edge 151 有 **1236** 个全局名。

| 指标 | 现状 |
|---|---|
| 覆盖率 | **99.68%** |
| 多余项 | **0**（硬断言） |

**多余项比缺失项严重。** 缺失只是功能不全；多余是宿主特征泄漏——一个
`AsyncIterator`（Node 24 的 V8 特性）出现在 window 上，就足够证明这不是浏览器。
所以多余项断言为 0，缺失项允许登记原因并配单调递减的上限。

### 第二层：原型成员与描述符

不只看名字在不在，还看它挂在哪、`writable`/`enumerable`/`configurable` 对不对、
是访问器还是数据属性。

| 指标 | 现状 |
|---|---|
| 原型完全一致 | **963 / 966** |
| 缺失成员 | **0** |
| 多余成员 | **0** |
| 描述符比对 | **8892** 个成员，**0** 处不符 |

这一层抓到过的典型问题：`Event.prototype.isTrusted` 实际是
`[LegacyUnforgeable]`，应该在**实例**上且 `configurable: false`，
挂在原型上就错了。

### 第三层：运行时行为

前两层都对，行为仍可能不同。这一层用 **144 个探针 / 16 类**覆盖：

`nativeToString`、`illegalInvocation`、`argumentCount`、`constructorGuard`、
`arityMetadata`、`errorShape`、`collections`、`cssom`、`canvas`、`audio`、
`intl`、`performance`、`eventTiming`、`crossRealm`、`urlParsing`、`typeTag`。

现状：**140 项一致，4 项登记**——2 项动态 iframe 时序（开
`limits.prewarmChildRealms` 后也一致），2 项宿主级差异（见下）。

三层不可替代的证据：`CSSStyleDeclaration` 在形状层**零差异**（双方原型都是
10 个成员），行为层却查出 **6 处**不同。形状层永远看不到那个洞。

**音频是第二个同样的例子**：`AudioContext` / `OfflineAudioContext` /
`OscillatorNode` / `AnalyserNode` / `AudioBuffer` 在形状层全部齐备、
descriptor 零差异，而 14 个新增行为探针里 **10 个不一致**——`ctx.length` 读出
`undefined`、destination 通道数是 2 而真实是 1、五处报错类型是 `RangeError` 而真实
是 `NotSupportedError` / `IndexSizeError`、`frequency.minValue` 是 float32 极值而真实
是 ±nyquist。形状完整、行为未验证，是最容易出「看起来对但算出来不一样」的地方。

### Intl 的天花板：ICU 数据不是同一份

`Intl` 直接用宿主 Node 的实现，而 Node 与 Chromium **各自打包 ICU**。实测差异
很窄——`NumberFormat` / `ListFormat` / `RelativeTimeFormat` / `PluralRules` /
`Collator` / `Segmenter` 全部逐字一致，只有语言**显示名**不同：

```
new Intl.DisplayNames('en-US', { type: 'language' }).of('zh-Hant')
  真实 Edge : "Chinese (Traditional)"
  Node 18–24: "Traditional Chinese"
```

四档 Node 给的都是后者，所以这是 ICU **数据版本**差异，不是 Node 版本差异
——宿主升级修不掉。同理 `new Intl.NumberFormat('!!')` 的报错文案：V8 13.x 改成了
`Invalid language tag: !!`，四档 Node 都还是 `Incorrect locale information provided`。
两条都已登记。

**时区相关的输出刻意不进探针**：实测 Chromium 在 Windows 上不理 `TZ` 环境变量、
只跟随操作系统时区，所以采集器锁不住它，写进 fixture 就是烙一个采集机的时区。
（NV8 自己能锁——子进程 env 会设 `TZ`，Node 认这个变量。）

### 这套机制抓出来的真实问题（举例）

- **legacy 模式下完全没有原生函数伪装**：
  `Function.prototype.toString.call(document.addEventListener)` 返回的是
  `call(...args) { return invoke(this, args); }`。这是一击致命的特征。
- **WebIDL 参数个数检查缺失**：真实浏览器少传参数会抛带固定格式的 TypeError。
  现在把检查沉到两个安装入口，用 `callback.length` 当权威来源
  （已验证 **3476** 个方法的 length 与真实 Edge 完全一致），
  而不是在 ~757 个调用点手写。
- **构造器错误消息缺后缀**：`Please use the 'new' operator` 少了
  `, this DOM object constructor cannot be called as a function.`（38 处）；
  `Illegal constructor` 少了 `Failed to construct 'X': ` 前缀（245 处）。
- **`readyState` 初值错误**：内联脚本执行时是 `complete`。正常页面**永远不可能**
  在 complete 状态下首次执行内联脚本——单一信号即可判定。
- **CSS 属性挂错位置**：745 个 CSS 属性在真实浏览器里是 style 对象的
  **自有属性**，不在原型上。挂到原型会让第二层报 745 个多余成员。
- **URL 主机校验按两类字符实现**：`https://a b/` 被原样放过。真实浏览器把主机
  字符分**三类**——safe 原样、escape 编码、forbidden 失败。空格属于 escape
  （编码成 `%20`），而规范条文和 Node 都判它失败。只分两类无论选哪一侧都错。

---

## 采集层

`src/collector/`。分层原则是**每一层只回答一个问题**：

```
PaginationScheduler   下一个请求是什么
Checkpoint            中断后从哪继续
      ↓
RateLimiter           现在能发吗
CircuitBreaker        对方还活着吗
NetworkPolicy         这个 origin 允许吗
ProxyPool             走哪个出口
      ↓
Transport             唯一的真实网络出口
      ↓
ResultSink            采到的东西放哪
```

### 分页调度（`pagination.js`）

拉取式 async iterator，`for await` 天然获得背压，随时 `break` 即停。

**三种上限，只做页数上限是不够的**：

| 上限 | 防什么 |
|---|---|
| `maxPages` | 游标永不为空 |
| **游标环检测** | 目标在绕圈 |
| `maxEmptyPages` | 到底了或出错 |

环检测最关键：只靠 `maxPages`，环形游标会在上限内**反复采同一页**——日志显示
「成功采集 500 页」，实际全是重复数据，且没有任何报错。环检测在第二次请求就停，
并报出**是哪个游标重复了**。

游标提取必须由 `nextRequest` 回调提供。`next_cursor`/`page`/`offset`/
`Link: rel=next`/嵌套字段各站点都不一样，内置猜测猜错的代价是**静默少采数据**。

### 断点续采（`checkpoint.js`）

存储是注入的（`load`/`save`/`clear` 三个方法），附内存与文件两个实现。

- **任务指纹防错续**：查询条件变了却接着旧游标走，会产出混合两次查询的数据
  且不报错——这是续采最危险的 bug。指纹用 canonical JSON，`{a,b}` 与 `{b,a}`
  必须同指纹。
- **保存在 yield 之后**：反过来的话，调用方处理该页时崩溃、检查点已前进，
  那一页数据永久丢失。代价是续采**一定有重叠**——宁可重复交付也不能跳过。
- **已见游标一起存**：不存的话续采后环检测从零开始。
- **文件存储原子写**（临时文件 + rename）：直接覆盖时进程被杀会留下截断的 JSON，
  等于丢掉全部进度。

### 限流（`rate-limiter.js`）

令牌桶（`requestsPerSecond` + `burst`）与 `maxConcurrent` 是**两个独立维度**：
只限速率会让慢响应堆成无界并发；只限并发会让快响应以无界速率打出去。

选令牌桶而不是固定间隔，因为真实浏览器是「突发十几个请求然后安静」，
**完全均匀的请求流本身就是特征**。

FIFO 公平不是可选项：「谁抢到算谁的」会让高频调用方饿死早到者，
表现为「第一页永远不返回」。

### 熔断（`circuit-breaker.js`）

按 origin 的三态熔断，半开态只放一个探针。

**输入必须只有目标健康度。** 计入：超时、连接错误、5xx、429。
排除：4xx、策略违规、abort、自身的 `CIRCUIT_OPEN`、以及**所有代理故障**。

混进调用方错误会毁掉信号——把策略违规算进去，一个配置失误就能跳闸一个 origin
并掩盖真实错误。

### 代理（`proxy.js` / `proxy-transport.js`）

零依赖实现 HTTP `CONNECT` 隧道与 SOCKS5 握手（`node:net` / `node:tls`）。

**代理故障必须与目标故障分开**——这是这个模块存在的首要理由。代理不通是
我们这一侧的出口坏了。混在一起时一个代理挂掉会让熔断器跳闸所有 origin
并归咎于目标，运维看到「所有站点都挂了」，真实原因被完全掩盖。所以代理用独立
错误码 `PROXY_*`，熔断器**硬排除**（即使调用方把它配进 `tripErrors` 也不生效）。

**默认 sticky 轮换**：很多站点把会话绑定 IP。中途换出口表现为莫名掉登录态，
看起来像「协议实现错了」，会把排查带向完全错误的方向。轮换必须显式选择。

**配了代理就绝不直连**：回落直连会泄露真实出口 IP，而且完全无声——请求成功、
采集正常，等到目标把真实 IP 拉黑才发现。要允许必须显式 `allowDirect: true`。

**凭据零泄露**：`password` 不可枚举，`toJSON` 只报 `authenticated: bool`，
错误消息只带脱敏 label。`JSON.stringify` / `util.inspect` / 对象展开 / 模板串
四条泄露路径各有断言。

### 结果落地（`result-sink.js`）

- **按 key 去重不按整体相等**：条目常带易变字段（`fetchedAt`、排序分数、
  A/B 分桶），按整体相等去重等于不去重。
- **`keyOf` 不给就不去重**：猜不出主键，猜错会把两条不同记录当成同一条、
  静默丢数据。宁可不去重也不猜。
- **NDJSON 而不是 JSON 数组**：进程被杀最多留下一个残缺末行，前面全部有效；
  JSON 数组写一半就是整个文件不可解析。`readNdjsonKeys` 跳过残缺行并**计数**。
- 批量写 + `close()` 必须冲干；`persist` 抛错时先清空缓冲，否则下次 flush
  会把同一批再写一遍。

### 协议层（`src/request-protocol/`）

把「一次请求」表达成可序列化、可校验、可比对的 `RequestPlan`，
适配器返回**声明式变换列表**而不是直接改计划——这样变换可审计、可重放、可测试。

配套 `canonical-json.js` 提供稳定序列化与摘要（键顺序无关），
是任务指纹与去重 key 的基础。

---

## Profile 与插件

**Profile** 描述「要一个什么样的浏览器」：版本、指纹字段、启用哪些插件、资源上限。

内置：`minimal`、`minimal-fetch`、`dom-replay`、`legacy-full`、
`edge-150`、`edge-151`。

```js
import { createProfile } from './src/profiles/index.js';

const profile = createProfile('edge-151');
```

**插件**是运行时装配单元，声明自己需要的能力与提供的表面。约束：

- 插件在 Sandbox 初始化期间**不得改动宿主 `globalThis`**
- 依赖按能力匹配解析，缺能力时给结构化诊断而**不修改全局**——
  破坏 `typeof` 特性检测比缺诊断更糟（[ADR-0002](docs/adr/0002-missing-capability-diagnostics.md)）
- 可生成 **Lock Plan** 锁定装配结果，保证跨环境一致

指纹字段遵循 [ADR-0005](docs/adr/0005-machine-specific-values.md) 一条铁律：
**浏览器身份照抄，机器特定值保持中性。**

已经踩过三次的坑：WebGL renderer、`hardwareConcurrency`/`deviceMemory`、
CSS `fontFamily`。最后一个尤其典型——采集时不锁 locale，采集机的系统语言会
以 `fontFamily: "Noto Sans SC"` 混进默认样式表，而 `navigator.language`
声明 `en-US`，形成比缺值更糟的**内部矛盾**。

**每次扩大采集范围都必须重跑这项审计**，「上次查过了」不是有效假设。

---

## Evidence 与离线回放

Evidence Bundle 把一次真实会话固化下来：页面 HTML、脚本、网络响应、Cookie。
之后运行时从 Bundle 回放，不碰网络。

```js
const sandbox = await EdgeSandbox.create({
  evidence: { path: './evidence/site.bundle.json' },
});
```

规则：

- 回放未命中 → **本地失败**，不回落真实网络
- Worker / ServiceWorker 脚本只允许来自 `data:` URL 或离线回放
- 动态 `import()` 同样走回放，允许列表作用于**解析后**的 URL
  （[ADR-0003](docs/adr/0003-dynamic-import.md)）

这条规则让采集可复现：同一个 Bundle 在任何机器上跑出同样结果。

---

## 进程后端与资源上限

两种后端，行为必须一致：

| 后端 | 说明 |
|---|---|
| `child-process` | 默认，隔离性最好，崩溃不影响宿主 |
| `worker-thread` | 启动更快，适合高频短任务 |

```js
await EdgeSandbox.create({
  execution: { backend: 'worker-thread' },
  limits: {
    timeoutMs: 1000,          // 墙钟超时（生产安全上限）
    maxHeapBytes: 512 * 1024 * 1024,
    maxRealms: 16,
    maxValueDepth: 32,
  },
});
```

### 关于 `timeoutMs`

默认 **1000ms** 是**针对不可信页面脚本的生产安全上限**，不是「操作应该多快」
的断言。做重度内省（遍历全部原型成员之类）时必须显式放宽：

```js
limits: { timeoutMs: 30_000 }
```

把测试绑在这个默认值上等于在赌执行时间，和写死 sleep 是同一类错误。

### 关于 `maxHeapBytes`

这个值有两个**互不相干**的用途：算 Realm 容量守卫，和设 V8 老生代上限。
后者有硬地板——引导一个完整 Realm（337 个 install）本身就要相当的老生代空间。

实测（Node 24，各 6 次并发）：

| 老生代 | 成功率 |
|---|---|
| 32MB | **0/6** |
| 48MB | **0/6** |
| 64MB | **5/6** ← 悬崖边 |
| 80MB | 6/6 |
| 128MB | 6/6 |

给太低时 V8 在引导过程中 OOM 并 `abort()`——收到 SIGABRT，**没有任何结构化
错误**，因为 abort 之后没有 JS 能再运行。所以 NV8 把 V8 上限钳制到 128MB 下限
（`src/controller/runtime-heap-floor.js`），同时**容量守卫仍按你配置的值计算**，
两者走不同路径。

---

## 指纹采集脚本

所有采集都用**无头 Edge + `--dump-dom`**，不用 Puppeteer/CDP
（CDP 本身就是特征，且引入依赖）。

| 命令 | 采集内容 |
|---|---|
| `npm run fingerprint:collect` | 身份字段（UA、brands、版本号等） |
| `npm run fingerprint:globals` | 1236 个全局名 |
| `npm run fingerprint:members` | 8941 个原型成员与描述符 |
| `npm run fingerprint:lengths` | 3496 个方法的 `length` |
| `npm run fingerprint:behavior` | 144 个行为探针 |
| `npm run fingerprint:css` | 745 个 CSS 属性名（保留真实枚举顺序） |
| `npm run fingerprint:ua-defaults` | 96 个标签 × 736 个属性的 UA 默认值 |

### 探针准入标准

一个行为探针要进库，必须：

1. **跨运行确定性** —— 采集脚本跑**两遍**并要求逐字节一致
2. **机器无关**
3. **可序列化**

因此刻意排除了 `measureText` 的字形宽度（依赖已装字体）和 `width`/`height`
（依赖视口与布局）。

### 探针定义必须共享

采集脚本与测试用**同一份**探针定义（`src/baseline/behavior-probes.js`）。
各写一份必然漂移，而一旦漂移，比对就失去意义。

### 采集方法论上的坑

- **采集基准版本必须与 profile 一致**。用 Edge 151 的 fixture 去比 150 的
  profile，会把版本门控的成员误报成缺失（这个坑踩过两次）。
- **布局相关属性的排除靠实测，不靠手写名单**。需要两轴差分：视口
  （800×600 vs 1400×900）与内容（空 div vs 填充 div）。只做视口那一轴会漏掉
  `height`/`blockSize`——空 div 在两种视口下都是 0px。
- **UA 默认值基线取 `<nv8unknown>`，不取众数**。众数会把 `unicodeBidi` 标错，
  并把覆盖项从 82 个标签虚增到 93 个。
- **`html` 与 `body` 必须直接测页面节点**。其余标签靠「创建元素塞进 body」测量，
  但 `<body>` 不能嵌进 body。漏掉的后果很直观：
  `getComputedStyle(document.body).display` 退回基线值 `inline`，
  而真实浏览器是 `block`。
- **Node 的 `URL` 不能当浏览器基准**。`https://a b/` 浏览器接受并编码，
  Node 直接抛。
- **跨页面/iframe 测量需要临时本地 HTTP 服务**（绑 127.0.0.1）。
  `file://` 让每个文件成为不透明源，iframe 拿不到 `parent`。
- **采集脚本必须能在开发机上直接跑**。7 个 collector 原来只列了 WSL(`/mnt/c`) 与
  Linux 的 Edge 路径，在原生 Windows 上必须每次手动 `--edge`。而「基准跟随本机
  Edge」要成为常规做法，就不能依赖手动传参——已补上 Windows 候选路径。

### 已测出的 151 → 152 差异

本机 Edge 已是 152，7 份 fixture 全部重采并与 151 对比过（**只采集、未换基准**）：

| 维度 | 151 | 152 | 变化 |
|---|---|---|---|
| 全局名 | 1236 | 1239 | +3：`NodeRange` `OpaqueRange` `PermissionsPolicy` |
| 原型 / 成员 | 966 / 8941 | 969 / 8957 | +6 成员，**−2**（`AbstractRange.startContainer/endContainer` 移到 `NodeRange`）|
| 方法 `length` | 3496 | 3508 | 已有方法**零变化** |
| 行为探针 | 112 | 112 | **零变化** |
| CSS 属性 | 745 | 746 | +`windowDrag`（`css-ua-defaults.js` 里本来就有）|
| UA 默认值 | 96 标签 | 96 标签 | 无 |
| UA / brands | `Edg/151` | `Edg/152` | brands **顺序与 GREASE 串都变了**：<br>`Not=A?Brand/99` → `Not?A_Brand/24`，Chromium 排到第一 |

两条值得单独记：

- **行为层零变化**说明探针可以跨 major 迁移，扩探针不必等特定版本。
- **brands 不只是版本号变了**，GREASE 品牌串与数组顺序都变。这类字段照抄才安全，
  按规律推导会错（ADR-0005 同一条铁律）。

换基准的阻塞项不在采集，而在 `finalize-window-surface-order.js` **没有生成器**：
新增全局要在那份 1.5 万行文件里手改三处（capture / delete / redefine）且顺序敏感。
这与「3 个全局名缺失待版本门控」是同一个阻塞，应当一并解决，否则换基准只会把
缺失全局从 3 涨到 6、把棘轮往上推而没有还债。

---

## 测试

```bash
npm test              # 全量，780 项
npm run test:matrix   # Node 18 / 20 / 22 / 24
npm run benchmark     # 性能基准
npm run baseline      # 重新生成基线快照
npm run audit:state   # 模块级可变状态审计
npm run capabilities  # 宿主能力探测报告
```

### 五条硬规矩

**1. 不许用固定时长 sleep。** 由 `tests/test-hygiene-test.js` 强制（上限 2ms）。
需要等待就用 `tests/helpers/async-wait.js` 轮询条件。

固定 sleep 的问题不是慢，是**它把「时间够了」冒充成「条件满足了」**——
在 CI 上一定会以随机的方式失败。

**2. 让位用的定时器不许 unref。** `async-wait.js` 里的 `sleep()` 曾经写了
`timer.unref()`，理由是「避免拖住进程退出」——恰好把作用弄反了：让位期间它就是
唯一该维持事件循环存活的句柄。unref 之后，只要此刻没有别的 refed 句柄，
事件循环直接排空，promise **永远不 settle**。

症状是 node:test 报
`Promise resolution is still pending but the event loop has already resolved`，
整个文件被 `cancelledByParent`。**36 项测试就这样一直没有真正运行过**，
而它们看起来只是「那几个文件红了」。用同一助手的其他文件却是绿的——
差别只在「当时恰好有没有别的活动句柄」。

比失败更糟的是这种沉默：一个断言从不执行，和它不存在没有区别，
但它在计数里、在报告里、在你以为已经覆盖了的地方。

**3. 偶发失败必须查到根因。** 不接受「资源竞争」这类结论。

真实案例：某项测试在全量套件里偶尔失败，前三次被归因为资源竞争。第四次用
**十路并发复现**（4/10 红），抓到 `SandboxChildExitError (signal=SIGABRT)`，
再打开子进程 stderr 看到 `FATAL ERROR: Reached heap limit`——
根因是 `maxHeapBytes` 被同时用于两件互不相干的事。修复后十路并发 10/10 绿。

**4. 断言「某件事没发生」不许靠等一段时间。** 那是同一个赌注换了方向。

要证明「没有多余的 `load`」，正确做法是造一个**因果哨兵**：先让被测操作完成，
再触发一次导航到哨兵 URL 并等它的 `load`。任何多余的中间事件都排在哨兵之前，
于是「有没有多余项」变成「序列是否恰好等于预期」。见
`tests/iframe-navigation-coalescing-test.js`。

等 200ms 看第三个事件有没有来是双输：一次子 Realm 构建要几百毫秒，等太短抓不到，
等太长就成了 CI 抖动源。

**5. 上界断言取多次采样的最小值，不取单次。**

冷启动预算原来只采一次样，在并行跑整套测试时它测的是「此刻机器有多忙」——
实测两次越过 3000ms 预算，而单独跑同一条只要几百毫秒。放大预算等于把噪声
正当化。取最小值是因为竞争只会让采样变大，所以最小值受污染最少。

还有个具体原因：**第一次采样包含宿主 ESM 图的加载**（约 1700 个模块，每进程
一次），那不是每次建沙箱都要付的成本。拿它去比 `benchmark` 报的 490ms，
比的是两件不同的事。

### 工具脚本必须跨平台

审计与采集脚本自己也会坏，而且坏法通常是**谎报通过**：

- `audit:state` 用 `path.relative()` 拼相对路径去比 `src/api/` 前缀。Windows 上
  `path.relative` 给反斜杠，前缀判断全部落空，审计于是报「0 项待迁移」——
  比崩掉危险得多。
- 同一个脚本还 `execSync('ls src/plugins/*/index.js')`，在 Windows 上直接
  `'ls' 不是内部或外部命令`，连带 3 项断言变红。审计脚本不该依赖外部命令。
- `new URL('..', import.meta.url).pathname` 在 Windows 上是 `/C:/...`，
  `path.resolve` 会拼成 `C:\C:\...`，`spawnSync` 的 cwd 则直接 ENOENT——
  而报错里显示的是 node.exe 的路径，看起来像「Node 装坏了」。
  一律用 `fileURLToPath()`（顺带解决路径含空格时残留 `%20`）。

### 性能预算

预算刻意宽松（冷启动上限 3000ms ≈ 实测的 6 倍）。目标是抓**数量级回归**，
不是抓 1.5 倍波动——CI 负载轻易波动 2~3 倍，卡太紧只会制造被学会忽略的假警报。

泄漏判据是**跨轮次增长**，不是绝对值。句柄数稳定在 6（5 个 PipeWrap +
1 个 ProcessWrap，是进程池的常驻子进程），只有单调增长才算泄漏。

---

## 命令一览

| 命令 | 说明 |
|---|---|
| `npm test` | 全量测试（780 项 / 76 个文件） |
| `npm run test:matrix` | 多 Node 版本矩阵 |
| `npm run test:node18` | 只跑 Node 18 |
| `npm run benchmark` | 冷启动 / 热执行 / Realm 创建销毁 |
| `npm run baseline` | 重新生成引导顺序 + 表面 + 可观测性基线 |
| `npm run audit:state` | 模块级可变状态审计（当前 0 项待处理） |
| `npm run capabilities` | 宿主能力三态报告 |
| `npm run build:bundle` | 生成 Realm 模块预打包缓存（本机产物） |
| `npm run check:bundle` | 校验缓存是否属于本机 |
| `npm run build:css-defaults` | 从 fixture 重新生成 UA 默认样式表 |
| `npm run fingerprint:*` | 见[指纹采集脚本](#指纹采集脚本) |

### 关于 `build:bundle`

`RealmModuleLoader` 支持把 4005 个模块预打包成一个 JSON 以减少文件读取。
这个缓存**以绝对 `file://` URL 为键**，因此与生成它的机器路径绑定。

仓库里曾提交过一份这样的包（3992 个键，全部以 `file:///D:/develop_software/Nv8/`
开头，15.8MB）。它在别的机器上命中率**恒为 0**，却仍要在每次进程启动时被
`readFileSync` + `JSON.parse`——实测冷启动因此慢约 90ms。这是个负优化。

现在它是 gitignore 的本机产物。在 Linux 上实测**没有可测量收益**
（435ms vs 424ms，噪声范围内），所以默认不生成；在文件 IO 更慢的平台上
（原作者的 Windows 环境）可能有效，自己测过再决定。

---

## 目录结构

```
src/
├── public/            对外入口（EdgeSandbox、选项归一化）
├── index.js           createNv8 / nv8Eval 入口
├── api/               浏览器 API 实现，按规范域分目录
├── install/           表面安装器（把 api 装到 Realm 上）
├── bootstrap/         Realm 引导（root / worker / worklet）
├── realm/             Realm 创建、模块加载、动态 import
├── webidl/            WebIDL 转换、原生函数伪装、跨 Realm 方法
├── plugins/           插件（约 30 个域）
├── plugin-sdk/        插件定义与能力匹配
├── profiles/          Profile 工厂、注册表、内置 Profile
├── presets/           插件预设组合
├── controller/        进程/线程后端与资源上限
├── child/ thread/     子进程与工作线程入口
├── protocol/          宿主↔子进程帧协议
├── request-protocol/  RequestPlan、适配器、声明式变换、canonical JSON
├── collector/         采集层（15 个模块）
├── evidence/          Evidence Bundle 与离线回放
├── baseline/          基线快照与行为探针
├── fingerprint/       GPU 等指纹身份
├── core/              Sandbox、插件注册表、状态作用域、诊断
└── compat/            Node 版本兼容

tests/                 76 个测试文件
scripts/               指纹采集与构建脚本
fixtures/              真实 Edge 采集结果与基线快照
docs/                  设计文档与 ADR
```

---

## 设计原则

这些不是口号，每一条背后都有一次踩坑。

**状态必须显式声明作用域。** 每份可变状态必须归属 `realm`、`page`、`origin`
或 `sandbox` 之一，由 `npm run audit:state` 强制（宿主图可变状态已从 85 降到 0）。
模块级可变状态在多 Realm 场景下会跨 Realm 泄漏，症状是「第二个 sandbox
行为不对」。

**策略检查先于凭据注入，也先于熔断检查。** 顺序错了会让配置失误被记成目标故障。

**能力是三态的。** `broken`（存在但行为不对）必须与 `unavailable` 区分——
把「有但坏」当成「没有」会让降级逻辑选错分支。

**多余项比缺失项严重。** 缺失是功能问题，多余是身份泄漏。

**登记而不是隐藏。** 三类登记表：`KNOWN_MISSING_*`（比对过，确实缺）、
`KNOWN_BEHAVIOR_DIFFERENCES`（探测过，不一致）、`UNPROBED_KNOWN_GAPS`
（明知不同，刻意不探）。每类都有**过期项检查**——它在一次基准版本修正后
立刻抓出了 4 个假缺口。

**不猜业务语义。** 分页游标、去重主键都必须显式指定。

**生成的文件必须有生成器。** 「声称是生成的但没有生成器」等于手写文件，
只是看起来更可信。这个坑本仓库踩过两次（module-bundle.json、
css-ua-defaults.js），现在都有了脚本。

**机器特定的产物不进版本库。** 与 ADR-0005 同一条原则，用在构建产物上。

---

## 已知边界

诚实列出，不粉饰。

### 三层对齐的剩余缺口

- **3 个全局名缺失**：`HTMLUserMediaElement`、`InteractionContentfulPaint`、
  `PerformanceSoftNavigation`。需要表面生成器支持按 `browserMajorVersion` 门控。
- **2 个行为探针不一致**，已登记（都是动态 iframe 时序）。
- **2 项刻意不探**（`UNPROBED_KNOWN_GAPS`，断言恰好为 2）：
  - CSS 属性描述符形状（访问器 vs 可写数据属性）。纯 JS 无法复制 V8 的
    命名属性拦截器。选访问器是因为读写语义正确性（自动同步 `cssText` 与
    `style` 属性）比描述符形状更重要——脚本天天读 `el.style.display`，
    几乎从不检查它的描述符。
  - 10 个布局相关计算值。
- **未覆盖的探针类别**：字体度量、Intl/时区格式化、时间精度。

### 布局相关

没有排版引擎，所以 10 个布局相关属性返回空串。返回空串比返回编造的数字好——
编造的值会在脚本比对宽高时给出错误结论。

### iframe

- **动态创建的 iframe，`contentWindow` 默认同步为 `null`**。子 Realm 引导需要
  254ms，无法在 `appendChild` 内同步完成。
  反爬脚本「从干净 iframe 取原生函数」的写法是同步的，所以这不是「指纹不对」而是
  **「跑不起来」**——脚本在那一行抛 TypeError。
  开 `limits.prewarmChildRealms`（0–8，默认 0）可以关掉这条：`create()` 会在页面
  脚本**之前**建好 N 个空白子 Realm，`appendChild` 之后 `contentWindow` 同步可用，
  `realm/identity-bundle` 的 16 个子项与真实 Edge 151 逐字相同。
  默认关闭是刻意的（每个池位 254ms + 占一个子 Realm 的堆额度），且池深 N 只覆盖建
  ≤N 个 iframe 的目标——**缓解不是根治**。
  实测依据与选项对比见 [ADR-0004](docs/adr/0004-dynamic-iframe-timing.md)。
- **空白 iframe 的 `location.href` 是父页面 URL 而非 `about:blank`**。
  已重新定性：`about:blank` 是第一个 **URL 与 origin 必须分离**的场合
  （URL 不透明、origin 继承父页面），而 NV8 目前把文档 origin 从页面 URL 推导，
  至少四处要解耦，是独立的改造。`srcdoc` 同理（真实是 `about:srcdoc`）。
- **`event.source` 在别名跨任务写法下退化**。同源子帧直写
  `parent.postMessage(x, '*')` 的 `event.source` 是精确的（靠 `parent` getter
  兼作 incumbent 标记）；写成 `const p = parent; setTimeout(() => p.postMessage(...))`
  会退化成父窗口自己。要精确需要真正的 incumbent 栈，见
  [ADR-0007](docs/adr/0007-parent-window-identity.md)。
- **容量拒绝在 iframe 上派发 `error` 事件**。真实浏览器的 iframe 导航失败从不派发
  `error`；容量拒绝是 NV8 内部条件、没有浏览器对应物，但派 `error` 仍是可检测的
  （脚本连建多个 iframe 就能看到）。堆容量守卫本身已修：原公式
  `floor(maxHeapBytes / 36MB)` 把根 Realm 也按 36MB 算，实测放行数超过堆能装下的
  数量，溢出是 **SIGABRT** 而不是结构化错误（128MB 安全上限 1 个、原放行 2 个）。
  现为 `floor((maxHeapBytes - 90MB) / 36MB)`，默认 512MB 的能力不变。
- **被顶掉的导航仍会建出子 Realm 再关掉**：真实浏览器压根不会开始。是 CPU
  浪费而非可观察偏差——导航合并本身是正确的（同一同步块内的多次属性变更只
  提交最后一次，见 `tests/iframe-navigation-coalescing-test.js`）。

### URL

主机解析已按真实 Edge 对齐（8 项探针全部一致，另有
[tests/url-parsing-test.js](tests/url-parsing-test.js) 28 项）。关键是主机字符
分**三类**而不是两类：

| 类别 | 字符 | 处理 |
|---|---|---|
| safe | 字母数字 `-._~` | 原样（字母折小写） |
| escape | 空格 `!"$&'()*+,;=` `` ` `` `{}` | 百分号编码 |
| forbidden | C0 / DEL / `%#/:<>?@[\]^\|` | 解析失败 |

**Node 不能当基准**——`https://a b/` 浏览器接受并编码为 `https://a%20b/`，
Node 直接抛。规范条文也把空格列为 forbidden domain code point，同样与浏览器
不符；依据是 Chromium `url_canon_host.cc` 的 `kHostCharLookup`。

**opaque path**（有 scheme 但没有 `//`：`about:` / `mailto:` / `data:` /
`javascript:` / `tel:` / `urn:`）此前完全不支持，后果分两种，第二种更糟：

| 输入 | 原行为 | 真实浏览器 |
|---|---|---|
| `new URL('mailto:a@b.com')` | THROWS | `mailto:a@b.com` |
| `new URL('mailto:a@b.com', base)` | `https://t.test/dir/mailto:a@b.com` | `mailto:a@b.com` |

抛错至少是显式失败；带 base 时它**静默**拼成一个 http URL，origin 还成了父页面
的。同时修了 origin：元组 origin 只属于特殊 scheme，其余（含
`nv8-unknown://x`、`about://x`）一律 `"null"`——拼出 `protocol//host` 会让两个
不同的不透明 origin 被判成同源，而同源判断错在放宽方向上比报错危险。

仍未实现：IDN / punycode（非 ASCII 主机原样保留）、IPv6 压缩形式的重新序列化、
IPv4 点分十进制的数值归一化。三者都无探针覆盖。

### legacy 导航

beforeunload / unload 事件已到位，但导航仍不替换文档（`location.href` 更新，
DOM 不变）。需要子 Realm 回调宿主。

### Node 版本

四档（18 / 20 / 22 / 24）**741/741 全绿**。差异分两类处理：

- **能补到与原生一致的就补**：`SuppressedError` / `DisposableStack` /
  `AsyncDisposableStack` / `Float16Array` 形状 / `DataView` 半精度。
  `full-surface.json` 的 node18/20/22 三档对这五个全局的记录与 node24
  **逐字节相同**。
- **补不像的就留空并登记**：`Iterator`、`Array.prototype.toSorted` 等、
  `RegExp.prototype.unicodeSets`、`Set` 集合运算、`ArrayBuffer.prototype.transfer`。
  补一个 JS 版本会让 `toString` 与报错文案都对不上，等于把「缺一个方法」
  换成「有一个假方法」——后者更容易被识别。

登记表是 `NODE_VERSION_DEPENDENT_MEMBERS`，与 baseline 共用同一份。

其他版本相关限制：

- `--experimental-vm-modules` 在**所有** Node 版本上都必需。
- Node 18 的 vm 模块链接是异步的，同步 `importUrl()` 不可用，
  必须走 `importUrlAsync()`（见 [docs/node-compatibility.md](docs/node-compatibility.md)）。
- **Node 22 之前，Realm 里的 `'X' in globalThis` 会调用 X 的 getter。**
  `vm` 直到 Node 22 才给 contextified global 接上 `PropertyQueryCallback`，
  之前 `has` 查询是用 getter 实现的。用户态修不了；标志位是
  `HAS_VM_PROPERTY_QUERY_CALLBACK`。别用 Proxy 包 globalThis 抹平——
  代理对象自身的可检测面比这条差异危险得多。
- Node 18/20 与 worker-thread 后端的性能基线尚未采集。

### 其他

- `plugin` 模式覆盖面小于 `legacy`，按需拉取（[ADR-0001](docs/adr/0001-plugin-surface-coverage.md)）。

完整待办见 [REMAINING_TASKS.md](REMAINING_TASKS.md)。

---

## 文档

| 文档 | 内容 |
|---|---|
| [docs/架构改造计划.md](docs/架构改造计划.md) | 架构与改造计划（**权威文档**） |
| [docs/edge-parity.md](docs/edge-parity.md) | 三层对齐现状与方法 |
| [docs/baseline.md](docs/baseline.md) | 基线快照机制 |
| [docs/protocol-collector.md](docs/protocol-collector.md) | 协议层与采集层 |
| [docs/evidence-contract.md](docs/evidence-contract.md) | Evidence 接口契约 |
| [docs/state-scope.md](docs/state-scope.md) | 状态作用域规则 |
| [docs/node-compatibility.md](docs/node-compatibility.md) | Node 18–24 兼容矩阵 |
| [docs/rust-migration-map.json](docs/rust-migration-map.json) | Rust 原实现 → JS 实现对应关系 |
| [docs/adr/](docs/adr/) | 架构决策记录（7 篇） |
| [REMAINING_TASKS.md](REMAINING_TASKS.md) | 完整待办 |
| [sandbox_manual.md](sandbox_manual.md) | Sandbox 使用手册 |

### ADR 索引

| ADR | 决策 |
|---|---|
| [0001](docs/adr/0001-plugin-surface-coverage.md) | 插件模式不追赶 legacy 覆盖面 |
| [0002](docs/adr/0002-missing-capability-diagnostics.md) | 缺能力诊断不修改全局 |
| [0003](docs/adr/0003-dynamic-import.md) | 动态 import 走离线回放 |
| [0004](docs/adr/0004-dynamic-iframe-timing.md) | 动态 iframe 用 opt-in 预热池，默认关闭 |
| [0005](docs/adr/0005-machine-specific-values.md) | 机器特定值不得进入浏览器身份 |
| [0006](docs/adr/0006-parity-layers.md) | 三层对齐职责不重叠 |
| [0007](docs/adr/0007-parent-window-identity.md) | 同源 `parent` / `top` 交出真实父 window |

---

## 许可

私有项目，未授权发布。
