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

**指纹敏感场景请用 Node 22+。** Node 18/20 的 V8（10.x / 11.x）在 dictionary
模式的 global object 上把**可枚举键排在不可枚举键之前**，不按插入序——违反
`[[OwnPropertyKeys]]`。后果是 `Object.getOwnPropertyNames(window)` 的顺序无法与真实
Edge 一致（实测 238 个全局排到了 V8 内建之前，`window` 落在索引 0 而真实 Edge
是 678）。而 `enumerable` 本身是要复现的契约值，不能为了顺序去改，所以这不是能
绕过去的实现问题。V8 12.x（Node 22）已修正。

`npm run capabilities` 会把这一项报成 `broken`：

```
- vm.global-property-order  broken  global keys are not in insertion order …
```

Node 18–22 还有一处更窄的差异：V8 内建段自身的注册顺序与 Chromium 152 不同
（TypedArray 家族的组内次序、`Iterator` 的位置）。那一段不由 NV8 安装也不由它
重排，已在 `tests/window-surface-order-test.js` 登记；Node 24 与 Chromium 逐位一致。

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
import { Collector } from './src/collection/collector/collector.js';
import { createPaginationScheduler } from './src/collection/collector/pagination.js';
import { createNdjsonResultSink } from './src/collection/collector/result-sink.js';
import { createMemoryCheckpointStore } from './src/collection/collector/checkpoint.js';

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

真实 Edge 152 有 **1239** 个全局名。

| 指标 | 现状 |
|---|---|
| 覆盖率 | **100%（152 profile）** |
| 多余项 | **0**（硬断言） |
| 枚举顺序 | 与真实 Edge 152 **逐字一致**（Node 22+） |
| own-descriptor 形状 | 1178 项，**0** 处不符 |

**多余项比缺失项严重。** 缺失只是功能不全；多余是宿主特征泄漏——一个
`AsyncIterator`（Node 24 的 V8 特性）出现在 window 上，就足够证明这不是浏览器。
所以多余项断言为 0，缺失项允许登记原因并配单调递减的上限。

### 第二层：原型成员与描述符

不只看名字在不在，还看它挂在哪、`writable`/`enumerable`/`configurable` 对不对、
是访问器还是数据属性。

| 指标 | 现状 |
|---|---|
| 原型完全一致 | **969 / 969** |
| 缺失成员 | **0** |
| 多余成员 | **0** |
| 描述符比对 | **8892** 个成员，**0** 处不符 |

这一层抓到过的典型问题：`Event.prototype.isTrusted` 实际是
`[LegacyUnforgeable]`，应该在**实例**上且 `configurable: false`，
挂在原型上就错了。

### 第三层：运行时行为

前两层都对，行为仍可能不同。这一层用 **186 个探针 / 25 类**覆盖：

`nativeToString`、`illegalInvocation`、`argumentCount`、`constructorGuard`、
`arityMetadata`、`errorShape`、`collections`、`worker`、`cssom`、`canvas`、`fontMetrics`、
`domRange`、`storage`、`fetch`、`crypto`、`xhr`、`websocket`、`indexedDB`、
`audio`、`intl`、`performance`、`eventTiming`、`crossRealm`、`urlParsing`、`typeTag`。

现状：**182 项一致，4 项登记**——2 项动态 iframe 时序（开
`limits.prewarmChildRealms` 后也一致），2 项宿主级差异（见下）。

三层不可替代的证据：`CSSStyleDeclaration` 在形状层**零差异**（双方原型都是
10 个成员），行为层却查出 **6 处**不同。形状层永远看不到那个洞。

**音频是第二个同样的例子**：`AudioContext` / `OfflineAudioContext` /
`OscillatorNode` / `AnalyserNode` / `AudioBuffer` 在形状层全部齐备、
descriptor 零差异，而 14 个新增行为探针里 **10 个不一致**——`ctx.length` 读出
`undefined`、destination 通道数是 2 而真实是 1、五处报错类型是 `RangeError` 而真实
是 `NotSupportedError` / `IndexSizeError`、`frequency.minValue` 是 float32 极值而真实
是 ±nyquist。形状完整、行为未验证，是最容易出「看起来对但算出来不一样」的地方。

### 顺序也是一维：Window 全局的枚举序

`Object.getOwnPropertyNames(window)` 的**序列**在真实 Edge 里是确定的。前三层谁都
没比过它，也没比过 window 自身那 1178 个受管理 own property 的 descriptor flag。
`tests/window-surface-order-test.js`（27 项）补上这一维，首轮就抄出三个真问题：

**1. 版本门控的全局错位。** `FontFaceSet` 只在 `browserMajorVersion >= 151` 暴露，
而旧实现是一份 1.5 万行生成代码、表达不了版本门控，于是它落在**索引 61**
（紧随 V8 内建之后），真实 Edge 是 **517**——其后 1171 个全局的索引全部偏移一位。
**只测默认 150 profile 永远是绿的**，因为 150 下这一项本来就不应存在——与 locale
那两条是同一类陷阱，所以测试同时断言 150 与 151 两个 profile。

**2. `window.chrome` 被写成了不可配置。** 1171 项里唯一一个 `configurable: false`
的数据属性。实测真实 Edge 152 是 `configurable: true`，且 WebIDL 没有任何机制产生
不可配置的数据属性（`[LegacyUnforgeable]` 产生的是访问器）。孤例 + 无规范依据 +
实测反证。后果不是形状好看不好看：`delete window.chrome` 返回 false、
`Object.defineProperty(window, 'chrome', …)` 抛 TypeError——而改写 `window.chrome`
正是反爬脚本常做的事。

**3. Node 18/20 上顺序根本对不上。** 见上面「环境要求」——V8 < 12 把可枚举键排在
前面。这是宿主限制，不是 NV8 能修的，已做成 `vm.global-property-order` 能力探针；
测试在这两档上用**反向断言**而不是跳过，宿主哪天修好了会红。

顺序现在是一张数据表（`src/surface/install/window-surface-order.js`，1178 项），
版本门控是一个字段：

```js
["FontFaceSet", VALUE_HIDDEN, { since: 151 }],
["HTMLUserMediaElement", VALUE_HIDDEN, { since: 151 }],
```

`{ pending }` 是「已登记的缺口」的**单一来源**：两份 parity 测试都从这张表读，
不各自维护名单。目前 152 基准没有 pending 全局；未来若出现暂未实现的接口，
仍必须在这张表登记理由，不能让缺口静默消失。

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

### locale 必须由 profile 决定，不能由宿主机器决定

这一层**行为探针验证不了**：探针的期望值来自真实 Edge，而采集时真实 Edge 的默认
locale 就是采集机的系统 locale——拿它当基准等于把采集机的 locale 写进契约。所以它
是一条**内部一致性**检查（`tests/intl-default-locale-test.js`）。

实测修复前的状态（Windows 中文系统）：profile 声明 `en-US`，而

```
Intl.DateTimeFormat().resolvedOptions().locale  → "zh-CN"   ← 宿主机器的
new Intl.ListFormat().format(['a','b','c'])     → "a、b和c"  ← 宿主机器的
```

`Intl` 的默认 locale 来自操作系统，profile 不起作用。zh-CN profile 在中文机器上
「看起来对」纯属巧合。后果有两层：`navigator.language` 与
`Intl.DateTimeFormat().resolvedOptions()` 对不上（这是最常一起被读的一对），
以及**同一 profile 在不同机器上给出不同身份**。

宿主侧改不了，逐个实测过：`LANG` / `LC_ALL` 在 Windows 无效、没有
`--icu-default-locale`、`vm.createContext()` 无 locale 选项。所以在 Realm 内接管：
包装 9 个 `Intl` 构造器与 8 个 `toLocale*` 方法，**仅在调用方没传 locales 时**填入
profile 的 `navigator.language`。`timezone` 本来就是对的（子进程 env 设 `TZ`）。

测试特意同时断言 zh-CN 与 en-US 两个 profile。**只测一个的话，在与之同语言的机器上
永远是绿的**——这正是这个 bug 藏住的原因。

### UA 默认字体族也跟着 locale 切

同一条一致性要求的另一半：`css-ua-defaults.js` 里 `fontFamily` 的基线是采集时那个
locale 的值，而 profile 的 locale 可切，字体必须跟着切。逐 locale 实测
（Windows 11 + Edge 152）：

| `--lang` | `getComputedStyle(document.body).fontFamily` |
|---|---|
| en-US / en-GB / de-DE / ru-RU / **zh-TW** | `"Times New Roman"` |
| zh-CN | `"Noto Sans SC"` |
| ja-JP | `"Yu Gothic"` |
| ko-KR | `"Malgun Gothic"` |

`zh-TW` 走通用默认，所以**不能按 `zh` 前缀一刀切**，要最长前缀匹配。`<pre>` 在八个
locale 下一律 `monospace`——标签级 override 与 locale 无关，覆盖只作用于**基线**值。

`zh-CN` 那一项特意核查过是不是开发机产物：`Noto Sans SC` 不是上古 Windows 自带字体，
但实测它在本机 `%WINDIR%\Fonts` 里（Windows 11 的中文语言支持会装），而同目录下
`simsun.ttc` / `msyh.ttc` 都在却**没被选中**——说明这是 Chromium 对 zh-Hans 的偏好
顺序，不是「碰巧只有 Noto」。Windows 10 上大概率会落到 `Microsoft YaHei`，所以这个值
做成**可覆盖字段**而不是硬编码，与 [ADR-0005](docs/adr/0005-machine-specific-values.md)
下的 `gpu-profiles.js` 同一个套路：值是**挑选**的，不是从开发机采下来就当真理。

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

`src/collection/collector/`。分层原则是**每一层只回答一个问题**：

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

### 协议层（`src/collection/request-protocol/`）

把「一次请求」表达成可序列化、可校验、可比对的 `RequestPlan`，
适配器返回**声明式变换列表**而不是直接改计划——这样变换可审计、可重放、可测试。

配套 `canonical-json.js` 提供稳定序列化与摘要（键顺序无关），
是任务指纹与去重 key 的基础。

---

## Profile 与插件

**Profile** 描述「要一个什么样的浏览器」：版本、指纹字段、启用哪些插件、资源上限。

内置：`minimal`、`minimal-fetch`、`dom-replay`、`legacy-full`、
`browser-profile-edge-v150`。Edge 150/151/152 的冻结指纹从对应的
`nv8/fingerprint/edge-150`、`nv8/fingerprint/edge-151`、
`nv8/fingerprint/edge-152` 子路径读取。

```js
import { createProfile } from './src/config/profiles/index.js';

const profile = createProfile('legacy-full');
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
（`src/backend/controller/runtime-heap-floor.js`），同时**容量守卫仍按你配置的值计算**，
两者走不同路径。

---

## 指纹采集脚本

所有采集都用**无头 Edge + `--dump-dom`**，不用 Puppeteer/CDP
（CDP 本身就是特征，且引入依赖）。

| 命令 | 采集内容 |
|---|---|
| `npm run fingerprint:collect` | 身份字段（UA、brands、版本号等） |
| `npm run fingerprint:globals` | 1239 个全局名 |
| `npm run fingerprint:members` | 8957 个原型成员与描述符 |
| `npm run fingerprint:lengths` | 3508 个方法的 `length` |
| `npm run fingerprint:behavior` | 178 个行为探针 |
| `npm run fingerprint:css` | 746 个 CSS 属性名（保留真实枚举顺序） |
| `npm run fingerprint:ua-defaults` | 96 个标签 × 736 个属性的 UA 默认值 |

### 探针准入标准

一个行为探针要进库，必须：

1. **跨运行确定性** —— 采集脚本跑**两遍**并要求逐字节一致
2. **机器无关**
3. **可序列化**

因此刻意排除了 `measureText` 的字形宽度（依赖已装字体）和 `width`/`height`
（依赖视口与布局）。

### 探针定义必须共享

采集脚本与测试用**同一份**探针定义（`src/infra/baseline/behavior-probes.js`）。
各写一份必然漂移，而一旦漂移，比对就失去意义。

### 采集方法论上的坑

- **采集基准版本必须与 profile 一致**。用 Edge 152 的 fixture 去比 150 的
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
- **临时目录不能硬编码 `/mnt/c/temp`**。三个用临时 HTML 页的 collector 各自写了
  这个路径——而它在 Windows 上**不是标准目录**，本机就没有，`mkdtempSync` 直接
  ENOENT。WSL 下 Windows 版 Edge 看不见 `/tmp`，所以确实需要一个 `/mnt/c` 下的
  目录，但得探测而不是假设（`scripts/edge-temp-dir.mjs`）。这类错误的特征是
  **在某个平台上从没跑过**，不是跑坏了。
- **采集页的顶层 `var` 会掺进结果**。经典脚本里顶层 `var` 会变成 globalThis 的
  own property：给 `collect-edge-globals.mjs` 加 descriptor 采集时，四个临时变量把
  1239 抬到了 1243。整段包在 IIFE 里。
- **形状也要采，不能猜**。Edge 152 的 window own property descriptor 中，WebIDL
  表面由 1178 项顺序表管理，另有 V8/不可重排项；猜错不会报错，只会变成一处可探测
  偏差——`chrome` 被写成 `configurable: false` 就是这么来的。
  `edge-globals.json` 现在带 `descriptors` 字段。

### 已测出的 151 → 152 差异

本机 Edge 已是 152，7 份 fixture 已全部重采，152 现在是对等性基准：

| 维度 | 151 | 152 | 变化 |
|---|---|---|---|
| 全局名 | 1236 | 1239 | +3：`NodeRange` `OpaqueRange` `PermissionsPolicy` |
| 原型 / 成员 | 966 / 8941 | 969 / 8957 | +6 成员，**−2**（`AbstractRange.startContainer/endContainer` 移到 `NodeRange`）|
| 方法 `length` | 3496 | 3508 | 已有方法**零变化** |
| 行为探针 | 144 | 178 | **+34：字体、DOM/Range/Selection、Storage、Fetch、Crypto、XHR、WebSocket、IndexedDB** |
| CSS 属性 | 746 | 746 | 无 |
| UA 默认值 | 96 标签 | 96 标签 | 无 |
| UA / brands | `Edg/151` | `Edg/152` | brands **顺序与 GREASE 串都变了**：<br>`Not=A?Brand/99` → `Not?A_Brand/24`，Chromium 排到第一 |

两条值得单独记：

- **行为层在换基准时保持原有 144 项一致**，本轮另增 10 项稳定探针覆盖字体解析、TextMetrics 形状和 DOM/Range/Selection；扩探针不必等特定版本。
- **brands 不只是版本号变了**，GREASE 品牌串与数组顺序都变。这类字段照抄才安全，
  按规律推导会错（ADR-0005 同一条铁律）。

换基准的阻塞项（`finalize-window-surface-order.js` 没有生成器、新增全局要在那份
1.5 万行文件里手改三处）**已解除**：顺序与 descriptor 形状变成了数据表，
版本门控是一个字段。现在刷新基准是三步：

```bash
npm run fingerprint:globals        # 采顺序 + descriptor 形状
npm run check:surface-order        # 先看差异（不一致则非零退出）
node scripts/build-window-surface-order.mjs --write
```

已用真实 Edge 152 完成重采：3 个新增全局自动带上形状，门控保留，1178 项表面
顺序与真实 152 **逐字一致**，原型成员和行为对等性测试也全部通过。

**顺序不是「旧顺序 + 追加新增项」**：实测 151 → 152 有 9 个已有全局挪了位置
（`FeaturePolicy` 523 → 69、`PerformanceLongAnimationFrameTiming` 333 → 1191，
`WebAssembly` / `XSLTProcessor` / `RTCDataChannel` / `PageRevealEvent` /
`onpagereveal` / `PerformanceScriptTiming` / `PerformanceTimingConfidence` 亦然）。
换基准必须整表重采，而这在 1.5 万行代码里等于重新生成整个文件。

`HTMLUserMediaElement`、`NodeRange`、`OpaqueRange`、`PermissionsPolicy` 和六个新增成员
已实现，并由 `tests/edge-152-surface-test.js` 锁定版本门控与运行时行为。

---

## 测试

```bash
npm test              # 全量，891 项（`node --test` 自动发现 tests/，新增测试不用注册）
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

### 测试入口不许手写路径

`package.json` 的 `test` 原来手写了 78 条测试路径。**新增测试不注册就静默不跑**
——与「修掉沉默失效的 36 项测试」同一类隐患：一个从不执行的断言，和它不存在没有
区别，但它在计数里、在报告里、在你以为已经覆盖了的地方。

现在是 `node --experimental-vm-modules --test`（不带参数，自动发现）。

为什么是无参数而不是 `--test tests/` 或 `--test 'tests/**/*-test.js'`：**两种形式
在四档之间不兼容**。Node 18/20 的位置参数只认目录，Node 22+ 只认 glob
（`--test tests/` 在 Node 24 上会去 `require('/path/tests')` 然后
`MODULE_NOT_FOUND`）。无参数模式是唯一四档通用的写法，`test-matrix.sh` 用的也是它。

代价是发现范围变成整个仓库，所以补了一条断言：**`tests/` 之外不得有匹配 Node
测试文件名模式的文件**。这条同时消掉了「测试住在产品树」——
plugin-sdk 那份测试原来在 `src/engine/core/` 下，用 `console.log` 分段、顶层断言，
既不在 `--test` 的计数里，第一项失败后面也全部不执行。

### 文档失步要靠断言，不靠 review

`sandbox_manual.md` 有 1537 行，其中一整节介绍 `ExecutionCore` /
`createExecutionCore` / `edgeCompatPlugins` 与四个 `nv8/` 子路径——**全部不存在**。
第 17 节还描述了一套九阶段审计，用到 5 个 npm 脚本，一个都没有，并配了一句
「不要伪造或清空 evidence 来绕过门禁」。

这类问题读一遍就能发现，但没人会为了 review 去逐条核对 1500 行手册。所以
`tests/docs-contract-test.js` 把三类**可机械核对**的引用变成断言：

- `npm run <script>` 必须在 `package.json` 的 `scripts` 里；
- `nv8/<subpath>` 必须在 `exports` 里；
- `src|tests|scripts|docs|fixtures/...` 的路径必须存在。

`docs/架构改造计划.md` 显式豁免路径检查——它是**规划**文档，描述目标结构就是它的
职责。豁免理由写在测试里，并且豁免项自身有过时检查：一个「允许不存在」的路径如果
其实存在，说明豁免过时了。

### 工具脚本必须跨平台

审计与采集脚本自己也会坏，而且坏法通常是**谎报通过**：

- `audit:state` 用 `path.relative()` 拼相对路径去比 `src/surface/api/` 前缀。Windows 上
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
| `npm test` | 全量测试（891 项 / 87 个文件，自动发现） |
| `npm run test:matrix` | 多 Node 版本矩阵 |
| `npm run test:node18` | 只跑 Node 18 |
| `npm run benchmark` | 冷启动 / 热执行 / Realm 创建销毁 |
| `npm run baseline` | 重新生成引导顺序 + 表面 + 可观测性基线 |
| `npm run audit:state` | 模块级可变状态审计（当前 0 项待处理） |
| `npm run capabilities` | 宿主能力三态报告 |
| `npm run build:bundle` | 生成 Realm 模块预打包缓存（本机产物） |
| `npm run check:bundle` | 校验缓存是否属于本机 |
| `npm run check:surface-order` | 校验 Window 全局顺序表与采集 fixture 一致 |
| `npm run build:css-defaults` | 从 fixture 重新生成 UA 默认样式表 |
| `npm run fingerprint:*` | 见[指纹采集脚本](#指纹采集脚本) |

### 关于 `build:bundle`

`RealmModuleLoader` 支持把 4010 个模块预打包成一个 JSON 以减少文件读取。
这个缓存**以绝对 `file://` URL 为键**，因此与生成它的机器路径绑定。

仓库里曾提交过一份这样的包（3992 个键，全部以 `file:///D:/develop_software/Nv8/`
开头，15.8MB）。它在别的机器上命中率**恒为 0**，却仍要在每次进程启动时被
`readFileSync` + `JSON.parse`——实测冷启动因此慢约 90ms。这是个负优化。

现在它是 gitignore 的本机产物。在 Linux 上实测**没有可测量收益**
（435ms vs 424ms，噪声范围内），所以默认不生成；在文件 IO 更慢的平台上
（原作者的 Windows 环境）可能有效，自己测过再决定。

---

## 目录结构

`src/` 顶层只有 8 项，**每一项就是一个职责**：

```
src/
├── index.js           createNv8 / nv8Eval 入口
├── public/            对外入口（EdgeSandbox、选项归一化）
│
├── engine/            运行时管道：不含任何浏览器 API 实现
│   ├── core/          Sandbox、插件注册表、状态作用域、诊断
│   ├── realm/         Realm 创建、模块加载、动态 import
│   ├── bootstrap/     Realm 引导（root / worker / worklet）
│   ├── webidl/        WebIDL 转换、原生函数伪装、跨 Realm 方法
│   ├── plugin-sdk/    插件定义与能力匹配
│   └── compat/        Node 版本兼容
│
├── surface/           浏览器表面：只做「有什么 API、装在哪」
│   ├── api/           API 实现，按规范域分目录（88 个域）
│   └── install/       安装器（把 api 装到 Realm 的 globalThis 上）
│
├── plugins/           装配策略：选哪些表面、依赖谁、声明什么能力
│
├── config/            身份与组合
│   ├── profiles/      Profile 工厂、注册表、内置 Profile
│   └── presets/       插件预设组合
│
├── backend/           进程/线程边界
│   ├── controller/    后端选择与资源上限
│   ├── child/         子进程入口与运行时池
│   ├── thread/        工作线程入口
│   └── protocol/      宿主↔子进程帧协议
│
├── collection/        采集链路：证据进、请求出
│   ├── collector/     采集层（15 个模块）
│   ├── request-protocol/  RequestPlan、适配器、声明式变换、canonical JSON
│   └── evidence/      Evidence Bundle 与离线回放
│
└── infra/             横向基础设施
    ├── baseline/      基线快照与行为探针
    ├── fingerprint/   GPU 等指纹身份
    ├── navigation/    URL 记录与导航
    ├── network/       请求捕获
    ├── scheduler/     任务调度
    ├── trace/         API 调用追踪
    └── utils/         logger

tests/                 82 个测试文件
scripts/               指纹采集与构建脚本
fixtures/              真实 Edge 采集结果与基线快照
docs/                  设计文档与 ADR
```

原来是 26 个顶层目录平铺，`api/`(3680 文件) 与 `network/`(1 文件) 并列。分层意图
只存在于阅读者脑子里，目录本身不说话。现在容器名就是职责名——决策依据、执行方式与
踩过的坑见 [ADR-0008](docs/adr/0008-source-layout-containers.md)。

**两个命名相近的 protocol 被拉开了**：`backend/protocol/` 是宿主↔子进程的帧协议，
`collection/request-protocol/` 是请求计划与适配器。它们从来不是一回事，
以前并列在顶层只能靠记。对外导出仍是 `nv8/protocol` → `request-protocol`。

### `surface/api/` 与 `plugins/` 有 18 个同名域，它们不是一回事

`surface/api/<域>` 是**实现**，`surface/install/install-<域>.js` 把实现装到 Realm 的
globalThis 上，`plugins/<域>` 是**装配策略**——声明这个域提供哪些能力、依赖谁、
以及在 Realm 里调哪个安装器。两条路径共用同一份 `api/` 与 `install/`：

```
legacy 模式   bootstrap-root.js  ──→ install-* ──→ api/*
plugin 模式   plugins/<域>.activate ──┘
```

**`install` 与 `activate` 的分工是硬约束。** `install-*` 函数操作宿主的
`globalThis`，在 Realm 建立之前跑会污染宿主进程。所以 `install(sandbox, registry,
config)` 这种三参数签名会被判为 legacy 并**跳过执行**，真正装表面必须在
`activate(context)` 里经 `context.moduleLoader.importUrlAsync()` 完成。

`plugins/canvas` 曾经把安装写在 `install` 里，于是整个插件是个空壳（加不加它
surface 一模一样），而它还声明了 `canvas.base` 能力——ADR-0002 那套缺失能力诊断
因此看不见这个洞。`plugins/dom` 与 `plugins/html` 则是**有意的聚合门面**：
它们的能力由 `dom-core` + `dom-collections` / `html-elements` 实际提供。

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

- **Edge 152 基准下全局名缺失为 0**：`NodeRange`、`OpaqueRange`、
  `PermissionsPolicy`、`HTMLUserMediaElement` 均已实现。
- **Edge 152 原型成员的枚举顺序已对齐**。采集器保留真实顺序，27 个存在实现差异
  的原型由专用顺序表校正，并由 `tests/prototype-order-parity-test.js` 锁定。
- **Node 18/20 上全局枚举顺序做不到一致**（宿主限制，见「环境要求」）；
  Node 18–22 的 V8 内建段自身顺序也与 Chromium 不同。Node 24 逐位一致。
- **4 个行为探针差异**，已登记：2 个动态 iframe 时序差异、2 个 Node/Chromium ICU 差异。
- **`illegalConstructor` 文案已对齐**：真实 Edge 只在 `new X()` 时带接口名，裸调用
  只报 `Illegal constructor`；28 个 runtime 模块已统一传递 `new.target`。
- **2 项刻意不探**（`UNPROBED_KNOWN_GAPS`，断言恰好为 2）：
  - CSS 属性描述符形状（访问器 vs 可写数据属性）。纯 JS 无法复制 V8 的
    命名属性拦截器。选访问器是因为读写语义正确性（自动同步 `cssText` 与
    `style` 属性）比描述符形状更重要——脚本天天读 `el.style.display`，
    几乎从不检查它的描述符。
  - 10 个布局相关计算值。
- **行为探针已扩展到字体、DOM Range、Storage、Fetch、Crypto、XHR、WebSocket、IndexedDB 与 Worker 入口契约**：
  当前 186 个探针 / 25 类，182 项与真实 Edge 一致；绝对字形像素宽度仍不进入契约，因为它依赖机器字体安装。
  ServiceWorker、Media、Web Animations、Observers、SVG 以及上述 API 的更深层语义另行登记。

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
  `realm/identity-bundle` 的 16 个子项与真实 Edge 152 逐字相同。
  默认关闭是刻意的（每个池位 254ms + 占一个子 Realm 的堆额度），且池深 N 只覆盖建
  ≤N 个 iframe 的目标——**缓解不是根治**。
  实测依据与选项对比见 [ADR-0004](docs/adr/0004-dynamic-iframe-timing.md)。
- **空白 iframe 的 URL/origin 已解耦**：`location.href` 和 `document.URL` 为
  `about:blank`，`location.origin` 继承父页面；`srcdoc` 对应 `about:srcdoc`，
  同样继承父页面 origin。该行为已由 `tests/iframe-about-blank-test.js` 覆盖。
- **`event.source` 的别名跨任务路径已补齐**。同源子帧直写或先保存
  `const p = parent` 再通过 `setTimeout`、`setInterval`、`requestAnimationFrame`、
  `queueMicrotask` 调用时，均保留发送子窗口；定时器入口保存并恢复 Realm incumbent，
  不改变页面可见的 `parent` 对象身份。
- **iframe 容量拒绝不再暴露为 DOM `error` 事件**。容量拒绝是 NV8 内部宿主条件，
  现在以导航结算的 `load` 结束，避免页面通过 `error` 事件探测实现配额；堆容量守卫
  仍返回结构化 `QuotaExceededError`，不会再触发子进程 **SIGABRT**（128MB 安全上限
  1 个子 Realm）。
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

beforeunload / unload 事件和整文档替换已到位：导航获准后会销毁旧 Realm、重建根
Realm 并重新执行文档生命周期；取消导航则保留原文档。

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
| [docs/adr/](docs/adr/) | 架构决策记录（8 篇） |
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
| [0008](docs/adr/0008-source-layout-containers.md) | 顶层目录按职责容器归口 |

---

## 许可

私有项目，未授权发布。
