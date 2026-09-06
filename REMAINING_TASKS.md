# NV8 架构改造 - 未完成任务清单（修正版）

## 当前状态
- **完成阶段**: Phase 3 (内置插件和预设配置) ✅
- **当前阶段**: Phase 5 (Evidence Bundle、Script Injector、Network Replay) 部分完成
- **测试状态**: 861 项（`npm test`，82 个文件）。Node 18 / 20 / 22 / 24
  四档全绿
- **项目性质**: 私有框架，无公开发布计划

---

## 一、Baseline 验收（行为基线）

### 已完成 ✅
- **完整 surface/descriptor 快照** - `src/infra/baseline/full-surface.js`
  - 枚举全部全局 own key + 各自原型成员（先前只覆盖精选 24 个）
  - fixture 存分组摘要，每全局压成一行 `type:members:symbols:digest16`（332KB）
  - 按**每个 Node major 逐档**存储（node18/20/22/24），四档均已录入并校验通过
  - 采集不触发 getter；Symbol key 只计数不展开，避免引擎顺序抖动
- **差异清单机制** - `src/infra/baseline/known-differences.js`
  - 每条差异必须有 owner / severity / reason / expectation
  - `blocking` / `tracked` / `environmental` 三级
  - `validateDifferenceRegistry()` 校验清单自洽，防止空壳条目绕过门禁
  - Node 版本造成的缺失（如 `Iterator` 需 22+）自动豁免且单独登记
- **工具** - `npm run baseline:surface`（校验 / `--write` / `--full`）
- **文档** - `docs/baseline.md`
- **测试** - `tests/baseline-full-surface-test.js`（11 项）

### 关键发现
完整枚举暴露出先前被掩盖的覆盖差距：

| 路径 | 全局数 | 原型成员数 |
|------|--------|-----------|
| legacy | 1234 | 8910 |
| plugin | 149 | 1671 |

精选 24 全局快照恰好只覆盖两条路径都已实现的部分，差距（一个数量级）被完全
掩盖。已登记为 `surface-coverage-gap`，severity 为 **blocking**——这是切换默认
模式的硬门槛。

### Node 版本差异（已固化）
实测每个 major 的 V8 内建都不同，合并分档会误报：

| 原型 | 18 | 20 | 22 | 24 |
|------|----|----|----|----|
| `Array.prototype` | 36 | 40 | 40 | 40 |
| `ArrayBuffer.prototype` | 3 | 6 | 9 | 9 |
| `String.prototype` | 50 | 52 | 52 | 52 |

四档 fixture 实测：

| 档 | legacy | plugin |
|----|--------|--------|
| node18 | 1233 / 8875 | 144 / 1615 |
| node20 | 1233 / 8885 | 144 / 1628 |
| node22 | 1234 / 8907 | 145 / 1650 |
| node24 | 1234 / 8910 | 149 / 1671 |

### 已完成 ✅（bootstrap 安装顺序）
- 三个 bootstrap 的**完整调用序列**入 fixture（root 337 / worker 109 / worklet 13 步）
- `diffBootstrapSequence()` 分 removed / added / reordered 三类报差异
- `reordered` 仅在集合一致时计算，避免增删导致的位移淹没信号
- 重复调用按次数比对，不去重
- `sourceSha256` 与行号降为 `informational`，不参与校验（对注释改动过度敏感）
- 有测试防止信息性字段被重新拉进校验，并交叉校验摘要与序列一致
- `npm run baseline:bootstrap`
- 已自证：互换两个相邻安装调用能被精确定位到位序

### 已完成 ✅（observability golden fixture）
- `src/infra/baseline/observability.js` 归一化 trace / network / navigation
- 剔除非确定性字段：`sequence`、trace 参数值、`*Truncated`、body 内容、
  navigation `key`/`id`；header 名小写排序，`state` 降级为 `hasState`
- 当前 golden：trace 33 / requests 1 / navigation 2，连续三次采集一致
- `diffObservability()` 逐条定位差异而非只比 digest
- 测试断言 fixture 不含非确定性字段，且 `outcome === 'replayed'`
  （baseline 永不触达真实网络）
- `npm run baseline` 一次跑完三项验收

**Baseline 章节已全部完成。**

---

## 二、Gate 1 验收 (Core 边界和后端契约)

### 已完成 ✅
- child process 和 worker thread 后端统一
- Frame Protocol 和 typed values
- 超时、输出、payload、frame queue、value depth 限制
- 资源清理和诊断系统

### 已完成 ✅（本轮新增）
- **Evidence 抽象接口** - `src/engine/core/evidence-contract.js`（零依赖）
  - `EvidenceSource` 8 方法契约，资源用不透明 id 标识
  - duck typing 校验，缺失方法全部列出
  - `TRUSTED_SCRIPT_POLICY` 归属 Core，含 `registered-only` 历史别名
  - `resolveTrustedScriptIds()` 统一策略解析，sandbox 与 runtime-pool 共用
- **适配器层** - `src/collection/evidence/evidence-source.js`
  - `createEvidenceSource(bundle)` 包装具体 Bundle
  - `createInMemoryEvidenceSource()` 无磁盘构造
- **Core 零依赖 Evidence** - 源码扫描测试强制，不靠约定
- **ScriptInjector 归位** - 迁至 `src/engine/core/`（零 import、与格式无关）

### 未完成项
- [ ] 所有后端异常的句柄泄漏验证

**状态**: ✅ Evidence 接口解耦完成（21 项测试）

---

## 三、Gate 2 验收 (Plugin SDK 和注册器)

### 已完成 ✅
- Plugin manifest 校验
- 能力依赖解析、版本检查、循环依赖检测
- 拓扑排序和安装顺序
- Plugin lock plan 生成
- GlobalSurfaceRegistry、StateRegistry、CapabilityRegistry

**状态**: ✅ 完成

---

## 四、Gate 3 验收 (现有实现适配)

### 已完成 ✅
- 大部分浏览器 API 已迁移为插件：
  - WebIDL、Events、DOM、DOM Collections
  - Storage、Navigation、History、Location
  - Fetch、XHR、Streams
  - Messaging、Worker、SharedWorker、ServiceWorker、Worklet
  - HTML Elements、iframe
  - Performance、Crypto、WebSocket

### 原「未完成（按需实现）」清单已作废 ✅

这里原先列了 14 组「未实现」的浏览器 API。**逐组核查后全部存在**，
按 `fixtures/baseline/full-surface.json`（node22 / legacy）：

| 组 | 抽查的全局 | 结果 |
|---|---|---|
| Canvas/WebGL/WebGPU | `CanvasRenderingContext2D` `WebGL(2)RenderingContext` `GPU` `GPUDevice` `OffscreenCanvas` | 6/6 |
| Media | `HTMLAudioElement` `HTMLVideoElement` `MediaSource` `RTCPeerConnection` `AudioContext` `MediaStream` | 6/6 |
| Device | `Geolocation` `BatteryManager` `Sensor` `Gyroscope` | 4/4 |
| CSSOM | `CSSStyleDeclaration` `CSSStyleSheet` `CSSRule` `CSSStyleRule` `StylePropertyMap` `CSSKeyframesRule` | 6/6 |
| SVG/MathML | `SVGElement` `SVGSVGElement` `MathMLElement` | 3/3 |
| 高级 DOM | `Range` `Selection` `ShadowRoot` `MutationObserver` `TreeWalker` `NodeIterator` `AbortSignal` | 7/7 |
| Blob/File | `Blob` `File` `FileReader` `FileList` `FileSystemHandle` | 5/5 |
| IndexedDB | `IDBDatabase` `IDBObjectStore` `IDBTransaction` `IDBRequest` `IDBFactory` | 5/5 |
| Cookie Store | `CookieStore` `CookieChangeEvent` | 2/2 |
| Permissions | `Permissions` `PermissionStatus` | 2/2 |
| Clipboard | `Clipboard` `ClipboardItem` `ClipboardEvent` | 3/3 |
| Credentials | `CredentialsContainer` `Credential` `PasswordCredential` | 3/3 |
| Web Animations | `Animation` `AnimationEffect` `KeyframeEffect` `AnimationTimeline` | 4/4 |
| Observers | `IntersectionObserver` `ResizeObserver` `PerformanceObserver` `ReportingObserver` | 4/4 |

权威口径不是这张表而是两个测试：`edge-surface-parity-test.js`
（多余 0、缺失全部登记）与 `edge-member-parity-test.js`
（969/969 原型成员集完全一致、缺失 0、多余 0）。

**但这只证明形状对，不证明行为对。** 当前行为层已有 144 个探针 / 16 类，覆盖
CSSOM、Canvas、音频、Intl、Performance、事件时序、跨 Realm 和 URL 等；Media /
IndexedDB / Web Animations / Observers / SVG / Range / Selection 等领域仍缺少专门
行为探针。真正的剩余工作在那里，见第十二节末。

留着一份「说 IndexedDB 未实现」的清单比没有清单更糟——照它决策会从零开始重做
一遍。这与本项目「登记而不是隐藏」的原则是同一条：登记表一旦失真就必须修，
不能放着。

### 模块级状态迁移 ✅ 已完成
先纠正一处此前的误判：`src/migration-targets/` 下的 90 个目录只是 Rust→JS
映射存根（`export * from` + 元数据），不含状态、无人引用，不是待迁移代码。

且经 RealmModuleLoader 加载的模块在每个 Realm 都会得到新实例，模块级 `let`
天然 Realm 隔离。真正跨 Sandbox 泄漏的只有**宿主 ESM 图**。

客观口径：`npm run audit:state`

```
宿主 ESM 图模块数      : 1813
待迁移的文件          : 0
待迁移的模块级状态    : 0
已审阅的进程级状态    : 4
```

- 宿主图待迁移状态 **85 → 0**
- `src/engine/core/state-scope.js` 提供 realm/origin/sandbox 三种作用域槽
- `tests/state-scope-test.js` 预算断言固定为 0，新增必须先迁移或显式登记豁免
- 4 处审阅后保留为进程级（扩展点注册表、SHA-512 常量缓存、Realm 上下文注册表、
  安装期上下文指针），每项在审计脚本中写明理由，并有测试校验理由非空
- 时钟语义已定案：指纹配置一致性由调用方统一传参保证，运行时游标
  （timeOrigin / 单调游标 / jitter PRNG）按 Realm 隔离
- 详见 `docs/state-scope.md`

---

## 五、Gate 4 验收 (Profile 和证据输入)

### 已完成 ✅
- Profile 工厂系统 (`src/config/profiles/index.js`)
- `minimal-fetch`、`dom-replay`、`legacy-full` 预设
- Profile 继承、覆盖、能力声明
- Evidence Bundle schema、loader、validator
- Script Injector (inline、external、defer、async、module)
- Network Replay (fetch、XHR、WebSocket)

### 未完成项
- [x] ~~**Evidence Loader 抽象接口**~~ - ✅ 已完成，见 `docs/evidence-contract.md`
- [x] **完整 Profile Node 支持矩阵** - 791 项在 Node 18 / 20 / 22 / 24 四档全绿；
  `full-surface.json` 四档 fixture 均用生成器在对应 major 上实跑
- [ ] **Bundle 签名和验证** - 防篡改、来源校验（可选）
- [ ] **Bundle 版本兼容性** - 跨版本迁移和降级（可选）
- [ ] **Profile 能力降级策略** - 缺失宿主能力时的行为
- [ ] **受信任脚本策略完整定义** - CSP、module 权限边界

**状态**: 基础实现完成，需要加固安全和兼容性

---

## 六、页面脚本生命周期

### 已完成 ✅（本轮修复三个规范偏差）

**一、`window.addEventListener` 在 inline 脚本执行时不存在（根因）**

`installGlobalEventTargetMethods()` 原先由 `executePageScripts()` 首行安装，
但 parser 阶段的 inline 脚本在 HTML 解析中就执行了。结果
`typeof globalThis.addEventListener === 'undefined'`，
`window.addEventListener('DOMContentLoaded', ...)` 直接抛 TypeError，
**脚本从那一行整段中断**。已提前到 lifecycle 模块加载后立即安装。

**二、`load` 事件派发在 document 而非 window**

`load` 规范上 `bubbles: false`，只在 document 派发会让
`window.addEventListener('load')` 永远收不到——而这是最主流的页面就绪钩子。
已改为在 window 派发。

> **后续修正**：当时为「兼容少数写法」保留的那份 document 派发，后来经真实
> Edge 151 实测证明是**可检测偏差**——真实浏览器里
> `document.addEventListener('load')` 从不触发。已移除，见第十二节。

`DOMContentLoaded` 改为带 `bubbles: true` 在 document 派发，靠冒泡到达 window。
第一版在两处各派发一次导致 window 监听器**触发两次**，已修正为只派发一次。

**三、inline `<script defer>` / `<script async>` 永远不执行**

parser 执行器无条件跳过 `defer`/`async`，而 `executePageScripts` 对 inline
非 module 脚本直接 `continue`——两头都不管，脚本被丢弃。浏览器只对**外部**
脚本应用这两个属性。已修正为只跳过外部 defer/async。

**顺带**：`defer` 与 `module` 原先是两个独立队列，规范上两者都在
DOMContentLoaded 前按**文档顺序**执行，已合并为单队列。

修复效果：

```
修复前: ["module","dom"]
修复后: ["inline-defer","module","doc:DOMContentLoaded",
        "win:DOMContentLoaded","win:load"]
浏览器: 同上（`doc:load` 不出现——见第十二节的实测结论）
```

测试：`tests/page-lifecycle-events-test.js`（11 项）。这些偏差此前没被抓到，
是因为现有测试统一用 `document.addEventListener`，而失效的恰好是
`window.addEventListener` 这条主流写法。

### 未完成项
- [x] **动态 `import()`** - ADR-0003 定案：离线重放 + 结构化拒绝
  - 相对 / 根相对 / 绝对 URL / `data:` 均支持，与静态 import 共用解析规则
  - 未命中给 `ERR_NV8_MODULE_REPLAY_MISS`，含 resolvedUrl 与可用模块列表
  - per-Realm 缓存，键为解析后绝对 URL；循环依赖不死锁
  - 任何情况下不触达真实网络
  - 测试 25 项（`tests/dynamic-import-test.js`）
- [x] Worker 路径动态 import 重放已接入；`evaluateModule()` 改用共享入口
- [x] eval 与 Worklet 保持拒绝并说明理由（eval 编译结果跨 Realm 复用，
  无法绑定 per-Realm 缓存；Worklet 规范不支持）
- [x] **真实 parser streaming** - 已实现，节点直接插入 document，遇 script 就地执行
  - 迁移前是 one-shot：整个文档先解析到 fragment、组装进 document，**然后**才
    批量执行 inline 脚本。脚本因此看到完整 DOM，且 `readyState` 已是 `complete`
  - 实测偏差三项全错：能看到后续 DOM / `body.children.length` 4 而非 2 /
    `readyState` `complete` 而非 `loading`
  - `readyState === 'complete'` 尤其致命——正常页面里 inline 脚本绝不可能
    在 complete 状态下首次运行，单条即可判定
  - 核心约束：**不能预建 body**。真实浏览器解析到 `<body>` 前
    `document.body` 是 `null`，head 里的脚本依赖这一点
  - `parseFragment` 增加 streaming 模式，与 fragment 模式共用 tokenizer；
    `innerHTML` 等行为不变
  - 测试 8 项（`tests/parser-streaming-test.js`）
- [x] **async 脚本下载竞态** - 确认**非缺陷**，已锁不变量
  - 原判断有误：规范规定 **DOMContentLoaded 只等 defer，不等 async**，
    async 在 DCL 之后执行完全合法（对应下载较慢的情形）
  - 离线重放下调度落在 DCL 之后并保持确定，是建模选择而非偏差
  - 断言精确位置等于把一次偶然调度当成契约，因此只锁不变量：
    defer 严格文档顺序 / defer 在 DCL 前且 readyState 仍 `loading` /
    `load` 等全部 async / 每个 async 只执行一次 / 脚本缺失派发 `error`
    且不派 `load` / 失败脚本不阻断 defer 队列
  - 测试 8 项（`tests/async-defer-order-test.js`）
- [x] **`document.open()`** - 文档重置语义已实现
  - 此前只改 readyState 和返回值，**不清空文档**——导致
    `open(); write(); close()` 把新内容追加到旧文档而非替换（最常见用法失效）
  - 现在移除所有子节点并重建空的 `html/head/body` 骨架（浏览器在 open()
    返回后立刻就有这三者可用）
  - 测试 10 项（`tests/document-open-test.js`），含二次 open()、分片 write
    缓冲、裸 close() 无副作用
- [x] **根窗口 navigation / 完整文档替换** - 卸载事件派发目标已校正
  - `pagehide` / `unload` 原先**只在 document 派发**，两侧都与真实浏览器相反
  - `document.close()` 兜底路径的 DCL 不带 `bubbles`，`load` 派在 document
  - 详见第十二节（含真实 Edge 实测数据）
- [x] **iframe `beforeunload` 取消** - 三条异议路径已补齐
  - `preventDefault()` 原本可用；`returnValue = '非空'` 与
    `onbeforeunload` 返回字符串两条历史路径原本失效
  - 真实页面里后两条比 `preventDefault` 更常见
  - 详见第十二节
- [x] **navigation error 时序** - 已与真实 Edge 对比并修正
  - 实测真实 Edge（iframe 导航）：200 / 404 / 500 均派发 `load`（错误页也是
    文档）；连接被拒与未知 scheme **不派发任何事件**；`src="http://%"`（畸形）
    派发 `load` 且旧文档被替换
  - **iframe 在导航失败时从不派发 `error`**——NV8 原先对畸形 URL 与不支持的
    scheme 都派 `error`，这是可检测偏差
  - 已修：不支持的 scheme 导航整体中止、不派发事件、不动当前文档；
    畸形 URL 改派 `load`
- [ ] **畸形 URL 未替换为错误页文档** - 真实浏览器提交错误页并替换旧文档，
  NV8 只派发 `load` 而保留旧文档。需要一份错误页 HTML 与新的子 Realm
- [x] **`new URL()` 校验与规范化** - 8 项探针全部一致
  - 关键发现：主机字符必须分**三类**而不是两类。原实现只有「合法/非法」两类，
    所以无论怎么调都错——全放过则 `http://%` 不抛，全拒绝则 `https://a b/` 误抛
  - 依据是 Chromium `url_canon_host.cc` 的 `kHostCharLookup`：
    **safe** 原样（字母数字 `-._~`）、**escape** 百分号编码（空格
    `!"$&'()*+,;=` 反引号 `{}`）、**forbidden** 解析失败
    （C0 / DEL / `%#/:<>?@[\]^|`）
  - **不能拿 Node 也不能拿规范条文当基准**：空格在两者眼里都是 forbidden，
    浏览器却编码成 `%20`。规范的 "forbidden domain code point" 与 Chromium 实现
    在这一点上不一致
  - 端口按**最左**冒号切分：`a:b:c` 的端口是 `b:c`，非法 → 整体失败。
    原实现按最右冒号切且只在尾段全是数字时才当端口，于是把 `a:b` 当主机名放过
  - 非特殊 scheme **不补**尾斜杠（`nv8-unknown://x` 而不是 `nv8-unknown://x/`）；
    特殊 scheme 忽略 `//` 后多余的斜杠（`http:///a` → `http://a/`），
    但 `file:` 例外（`file:///etc/passwd` 的主机确实为空）
  - setter 对非法值**静默忽略**而不是抛，所以主机解析器返回 `null` 让调用方决定；
    在解析器里抛的话 setter 得包 try/catch，而 catch 无法区分「值非法」与「有 bug」
  - 仍未实现且无探针覆盖：IDN / punycode（非 ASCII 主机原样保留）、
    IPv6 压缩形式重新序列化、IPv4 点分十进制数值归一化
  - 测试 28 项（`tests/url-parsing-test.js`）+ 8 项探针
- [x] **URL 支持 opaque path** - `about:` / `mailto:` / `data:` / `javascript:` /
  `tel:` / `urn:` 此前完全不认
  - 后果分两种，**第二种更糟**：
    `new URL('mailto:a@b.com')` 抛错；而
    `new URL('mailto:a@b.com', base)` **静默**拼成
    `https://t.test/dir/mailto:a@b.com`，origin 还成了父页面的。
    脚本拿它去比对、发请求、判同源都会走到完全错误的分支
  - 特殊 scheme 即使没写 `//` 也**不是** opaque path：规范的
    "special authority ignore slashes state" 会跳过缺失或多余的斜杠，
    所以 `http:example.com/p` 等价于 `http://example.com/p`。
    不处理这条的话它会被当成 opaque path，origin 变 `null`
  - opaque path 只能用 fragment 做相对解析基准；相对路径必须失败而不是
    编一个结果。空串按「沿用 base」处理（`new URL('', location.href)` 很常见）
  - `host` / `hostname` / `port` / `pathname` 四个 setter 对 opaque path
    静默忽略——真去写会造出 `mailto://host` 这种既无法序列化回原样、
    也不可能出现在真实浏览器里的记录
  - **顺带修 origin**：元组 origin 只属于特殊 scheme，其余（含
    `nv8-unknown://x`、`about://x`）一律 `"null"`。拼出 `protocol//host` 会让
    两个不同的不透明 origin 被判成同源，而同源判断错在**放宽**方向上比报错危险。
    `file:` 保留 `file://`，与 Chromium 实测一致
  - 这一组不存在「浏览器与规范打架」的情况（不像主机里的空格），按规范实现即可
  - 这也是把空白 iframe 的 `location.href` 修成 `about:blank` 的前置条件——
    在此之前 `new URL('about:blank')` 直接抛
- [x] **iframe 畸形 URL 现在走 malformedUrl 分支** - 顺带修好
  - `html-iframe-element-realm-state.js` 早就写好了 `malformedUrl` 分支，
    但 `new URL('http://%')` 从不抛，所以那条分支**从未执行过**——
    iframe 反而拿 `http://%/` 建了个真的子 Realm。现在 URL 会抛，分支才真正生效
- [x] **iframe 导航合并** - 原记为差距，**重测后不成立**，已改为锁住现状
  - 原记录：「NV8 对每次属性变更立即导航，会先派发一次中间 blank 的 `load`」
  - 实测四个场景（`tests/iframe-navigation-coalescing-test.js`，4 项）：
    同步块内 srcdoc 后改 src → 只有 target 一次 load；同步连设两次 src →
    只有最后一个；append 后立刻设 src → 一次；append 后立刻 remove →
    不留下子 Realm
  - 已经正确的原因是**合并发生在完成时而不是调度时**：`navigate()` 每次给
    元素记录的 `version` 加一，在飞的那次完成后检查
    `current.version === version`，不等就 `handle.close()` 且**不派 `load`**
  - 曾按原记录实现「用微任务排队合并」，实测前后四个场景可观察行为**完全一致**，
    于是回滚：为一个测不出收益的改动引入 `navigateClient()` 的 promise 身份变化
    是纯风险
  - 断言方式值得记一笔：不用「等 200ms 看还有没有第三个 load」——一次子 Realm
    构建要几百毫秒，等太短抓不到、等太长成 CI 抖动源。改用**因果顺序**：目标
    load 到达后再导航到一个哨兵 URL，任何多余的中间 load 都排在哨兵之前，
    于是「有没有多余项」变成「序列是否恰好等于预期」
- [ ] **被顶掉的导航仍会建出子 Realm 再关掉** - 剩下的真实差别，无探针覆盖
  - 真实浏览器压根不会开始那次导航；NV8 会走完 `createChildRealm()` 再
    `handle.close()`。是 CPU 浪费（一次构建几百毫秒）而非可观察偏差
  - 三次非侵入式测量（可观察 load 序列 / 峰值 Realm 数 / Realm id 序号）
    **都没能测到**它，所以不写成结论
  - 与「iframe Realm 绕过堆容量守卫」是同一片区域（在飞的创建已经吃掉内存），
    应一并处理

---

## 七、Worker 和模块加载器

### 已完成 ✅
- Dedicated Worker、SharedWorker、Worklet 基础实现
- Worker 脚本从 offline replay 或 `data:` URL 加载
- module Worker 静态 import
- Worker 消息传递和生命周期
- Worker 资源清理

### 未完成项
- [x] **动态 `import()` 策略** - ADR-0003 定案：离线重放 + 结构化拒绝
  （实现与测试见第六节，25 项）
- [ ] **SharedWorker/Worklet graph 指纹** - 版本和缓存
- [ ] **module cache 作用域和销毁** - 模块缓存生命周期
- [ ] **pending module evaluation 取消** - 取消未完成的模块加载
- [ ] **Worker 并发/深度/关闭限制** - 防止资源耗尽

**状态**: 基础实现完成，高级策略待定义

---

## 八、Gate 5 验收 (Protocol 和 Collector 边界)

### 已完成 ✅
- **Protocol 层接口定义** - `src/collection/request-protocol/`
  - `RuntimeArtifact` 契约：canonical JSON、schema 版本、摘要、过期语义
  - `ArtifactSet` 有界集合（数量/单体字节/总字节限制）
  - `RequestPlan` 归一化（header 小写、多值保序、CRLF 注入防护、摘要稳定）
  - 12 种声明式 `RequestTransform` + 跨适配器冲突检测
  - `defineProtocolAdapter()` 窄接口（context 只有 request/artifacts/now）
  - `ProtocolRegistry` 编排、transform 溯源、plan diff、协议 lock
- **Collector 层** - `src/collection/collector/`
  - `NetworkPolicy` 默认拒绝、origin allowlist（含通配子域）、scheme/method 限制
  - 重定向策略（默认拒绝，跨 origin 需显式开启）
  - `CredentialStore` origin 精确绑定、脱敏、注入时机在策略检查之后
  - `RetryPolicy` 策略拒绝永不重试、幂等性判定、确定性退避、`Retry-After`
  - `CookieJar` 会话 cookie，与 Realm `document.cookie` 完全隔离
  - `Transport` 抽象（fetch 实现 + 确定性 stub）、超时包装
  - 有界脱敏审计日志
- **端到端链路** - `tests/gate5-end-to-end-test.js`
  - Evidence → Runtime → Artifact → Protocol → RequestPlan → Collector 全链路
  - 链路摘要可复现
- **边界断言**（测试化，非仅约定）
  - 沙箱脚本无法获得真实网络响应
  - 适配器 context 不含 transport/collector/fs
  - 被拒绝 origin 不产生任何出网数据包
- **文档** - `docs/protocol-collector.md`

### 未完成项
- [x] **Collector 上层编排** - 分页 / 限流 / 熔断 / 检查点全部完成，见下方各条。
  这条原先与下面的 `[x]` 直接矛盾，属于早期清单没跟着实现更新
- [x] **数据持久化** - 结果落地与增量去重完成（`result-sink.js`，23 项）。
  刻意不内置 DB 驱动，接口是 `write/flush/close`，见本节末「真实存储适配」
- [x] **代理支持** - `src/collection/collector/proxy.js`，44 项测试（含真实隧道）
  - **代理故障必须与目标故障分开**（本模块首要理由）：代理不通是我们这一侧的
    出口坏了。混在一起 → 一个代理挂掉 → 熔断器跳闸所有 origin → 运维看到
    "所有站点都挂了"，真实原因被完全掩盖。独立错误码 `PROXY_*`，
    熔断器**硬排除**（即使调用方把它配进 `tripErrors` 也不生效）
  - **默认 sticky 轮换**：很多站点把会话绑定 IP。中途换出口表现为莫名掉登录态，
    看起来像"协议实现错了"，会把排查带向完全错误的方向。轮换必须显式选择
  - **凭据零泄露**：`password` 不可枚举，`toJSON` 只报 `authenticated: bool`，
    错误消息只带脱敏 label，解析失败的 URL 也先 redact。有断言覆盖
    `JSON.stringify` / `util.inspect` / 展开 / 模板串四条泄露路径
  - **健康冷却**：没有冷却的话挂掉的代理会在每轮轮换里反复被选中，把成功率拖到
    1/N，而每次失败看起来都是随机的。全部冷却时**抛 `PROXY_EXHAUSTED`**，
    不退回用已知坏的——那会把故障重新伪装成目标故障
  - **可重试性分级**：407/凭据被拒/规则不允许 → 不可重试（重试永远不会通过）；
    连不上/502/host unreachable → 可重试
  - HTTP `CONNECT` + SOCKS5 握手均零依赖（`node:net`/`node:tls`）。
    分段解析已验证：CONNECT 响应头跨 TCP 段、SOCKS5 每步按需取字节
  - 半配凭据（只给用户名）是配置错误而非空密码——静默当空密码会让认证在远端
    失败、报成"代理不通"，把配置问题伪装成网络问题
- [x] **代理接入 transport** - `src/collection/collector/proxy-transport.js`，13 项测试
  - 基于 `node:http`/`node:https`，通过 `createConnection` 把隧道 socket 交给
    HTTP 客户端；HTTPS 目标在隧道内再叠一层 TLS，`servername` 必须是**目标**
    主机名（写成代理主机名会让 SNI 与证书都对不上）
  - **配了代理绝不直连**：回落会泄露真实出口 IP，且完全无声——请求成功、
    采集正常，等到目标把真实 IP 拉黑才发现。要允许必须显式 `allowDirect`
  - **响应体边收边判上限**：先缓冲完再检查的话，超限本身就是被撑爆的那一刻
  - **修 bug**：`finish()` 必须在 `destroy()` **之前**调用。反过来的话
    `destroy()` 触发的 error 事件会先把结果写成通用的 `REQUEST_FAILED`，
    真正的原因（超过上限）就丢了。测试红过一次才发现
  - **隧道建成后的失败归目标，不冷却代理**：代理已经证明自己能用，
    因目标的问题冷却出口会把可用出口一个个误伤掉
  - body 编码规则抽成 `buildRequestPayload()` 与 fetch transport **共享**：
    一旦分叉，同一个计划在两条路径上会发出不同请求，而这种差异极难察觉
    ——通过代理时成功、直连时失败，看起来像"代理有问题"
- [x] **仓库死代码清理** - 死 JS 文件从 1504 降到 **0**（4237 个文件全部可达）
  - **陈旧的机器特定构建产物**：`src/engine/realm/module-bundle.json` 15.8MB，
    3992 个键全部以 `file:///D:/develop_software/Nv8/` 开头。加载器以绝对
    `file://` URL 为键，所以本机命中率**恒为 0**，却仍要每次启动
    `readFileSync` + `JSON.parse`。实测冷启动因此慢约 90ms（526 → 431ms）
    ——一个负优化。已删除 + gitignore + 补 `scripts/build-module-bundle.mjs`
    生成器（带 `--check` 识别外来包）。在 Linux 上实测本机包**也没有可测量
    收益**（435 vs 424ms，噪声内），故默认不生成
  - **1465 个纯 re-export 垫片**：`src/migration-targets/` 6.2MB，
    没有任何代码引用。折叠为单一清单 `docs/rust-migration-map.json`（231KB），
    1465 条映射一条不丢，文件数从 1465 降到 1
  - **废弃的 `src/engine/core/` 平行子包**：`plugin/`、`registry/`、`app/`、
    `scheduler/`、`trace/`、`legacy/`、`types/`、`index.js`、
    camelCase 重复文件、自带的 `package.json` 与 vendored `node_modules/semver`
    （项目零依赖，该 semver 只被这个死子包引用）
  - **孤儿测试**：`test/core-integration.test.js`(11 红)、
    `src/core/test/*`(5 红)、`src/plugins/webidl-foundation/test.js`(1 红)、
    `tests/profile-system-test.js`（import 块损坏）。孤儿测试比没有测试更糟
    ——看起来像覆盖，实际从不运行
  - **13 个死的 `*-surface.js`** 与 3 个废弃 controller 文件
    （`worker-thread.js` 已被 `worker-thread-pool.js` 取代）
  - **18 份互相矛盾的历史文档**：根目录 7 份 + `docs/phase3-*` 等 11 份
  - 清理后 `npm test` **706/706 绿**
- [x] **UA 默认样式表漏了 html 与 body** - 实测
  `getComputedStyle(document.body).display` 返回 `inline`，真实 Edge 是 `block`
  - 根因是采集方法：其余标签靠"创建元素塞进 body"测量，而 `<body>` 不能嵌进
    body，于是这两个标签根本没进 `TAGS` 名单，计算值退回 `<nv8unknown>` 基线
  - 修法是直接测页面上已有的 `document.documentElement` 与 `document.body`
  - 重采后真实 Edge 给出 `html: display=block margin=0px`、
    `body: display=block margin=8px`；覆盖标签 86 → 88，零丢失
  - 顺带补了缺失的生成器 `scripts/build-css-ua-defaults.mjs`——原先
    fixture 在仓库里、生成它的代码不在。"声称是生成的但没有生成器"等于手写
    文件，只是看起来更可信
- [ ] **WebSocket 采集** - 当前只支持 HTTP
- [x] **熔断器** - 按 origin 的三态熔断（`src/collection/collector/circuit-breaker.js`，22 项测试）
  - `CIRCUIT_OPEN` 错误码早就在 `errors.js` 里定义了但没实现——缺口是设计时
    就意识到的
  - **按 origin 而不是全局**：采集常同时打主站 + CDN + 验证码服务，
    全局熔断会让次要服务拖垮整轮
  - **half-open 只放一个探针**：放多个的话目标未恢复时会一次性收到一批失败
  - **只计目标侧失败**：超时 / 连接错误 / 5xx / **429** 计入；
    4xx、**策略违规**、abort、自身的 CIRCUIT_OPEN 都不计。策略违规计进去会让
    一次配置失误把 origin 熔断掉，反过来掩盖真正的错误
  - 不计入的失败**也不当成成功**——否则配置错误会清零真实的连续失败计数
  - 熔断检查排在策略检查**之后**，保证违规请求先被挡掉
- [x] **限流与并发控制** - 令牌桶 + 并发上限（`src/collection/collector/rate-limiter.js`，18 项测试）
  - 速率与并发是**两个独立维度**：只限速率，慢响应会堆积出无限并发；
    只限并发，快响应让速率无上限
  - **令牌桶而不是固定间隔**：真实浏览器加载页面会并发打十几个请求再安静几秒，
    固定间隔会把这种自然突发拉平成机械匀速，反而更像机器人
  - **FIFO 公平**：按到达顺序放行。若按"谁先抢到令牌谁走"，高频调用方会持续
    插队，分页采集里会表现为"第一页迟迟不返回"
  - 等待与 abort **竞速**，不是只在轮询点检查——否则长等待期间取消不生效
  - `release` 幂等：调用方写在 finally 里，异常路径可能重复触发，
    重复归还会把 inFlight 减成负数、并发上限失效
  - 限流在每次**尝试**内取许可：放在 send() 外只会限"逻辑请求数"，重试就绕过了
- [x] **分页调度** - `src/collection/collector/pagination.js`，21 项测试
  - **拉取式**（async iterator）而不是回调式：调用方 `for await` 天然获得背压
    （处理完一页才要下一页），也能随时 `break` 提前停止。回调式要额外设计
    暂停/恢复协议
  - **游标提取必须由调用方给**：`next_cursor` / `page` / `offset` /
    `Link: rel=next` / 嵌套字段各站点都不一样，内置猜测猜错的代价是**静默少采
    数据**。`nextRequest` 是必需回调，报错文案直接说明"cursor shapes are
    target-specific and cannot be guessed"
  - **三种上限，只做页数上限是不够的**：
    - `maxPages` 防游标永不为空
    - **游标环检测**——游标重复说明目标在绕圈。只靠 maxPages 会在上限内反复采
      同一页，看起来"采了 N 页"其实全是重复。实测环形游标在**第二次请求**就停，
      而不是跑满 50 页
    - `maxEmptyPages` 连续空页说明到底或出错；设 0 可关掉（有些 API 中间会返空页）
  - 停止原因结构化（`exhausted` / `max-pages` / `cursor-loop` / `empty-pages` /
    `aborted`），环检测还报出**是哪个游标重复了**——诊断要能直接定位
  - **不做错误恢复**：collector 失败直接抛。重试是 RetryPolicy 的职责，
    在这里吞掉会让"少采一页"变成静默数据丢失
- [x] **采集进度检查点** - `src/collection/collector/checkpoint.js`，20 项测试
  - **存储是注入的**，不内置数据库：Collector 层不该拥有 DB 驱动，那会把网络
    出口层变成数据层。只定义 `load/save/clear` 接口，附内存与文件两个实现
  - **任务指纹防错续**：查询条件变了却接着旧游标走，会产出混合两次查询的数据
    且**不报错**——这是续采最危险的 bug。指纹用 canonical JSON，
    `{a,b}` 与 `{b,a}` 必须同指纹，否则续采会莫名失效
  - **保存在 yield 之后**：yield 之前保存的话，调用方处理这一页时崩溃、
    检查点已前进，那一页数据永久丢失。代价是续采**一定有重叠**——
    宁可重复交付也不能跳过，去重是调用方的责任（有专门断言锁住这条语义）
  - **已见游标一起存**：不存的话续采后环检测从零开始，绕回旧页发现不了
  - 文件存储**原子写**（临时文件 + rename）：直接覆盖的话进程被杀会留下截断
    的 JSON，等于丢掉全部进度。有断言检查无 `.tmp` 残留
  - 损坏的检查点返回 null 而不是抛——应当导致"重新开始"，不该让整个任务起不来
  - jobId 清洗防目录穿越（`../../escape`），并附摘要防 `a/b` 与 `a_b` 撞名
- [x] **结果落地与增量去重** - `src/collection/collector/result-sink.js`，23 项测试
  - 与检查点配套：**续采一定重复交付条目**，落地端必须能幂等吸收
  - **按 key 去重不按整体相等**：条目常带易变字段（`fetchedAt`、排序分数、
    A/B 分桶），按整体相等去重等于不去重
  - **`keyOf` 不给就不去重**：猜不出哪个字段是主键，猜错会把两条不同记录当成
    同一条、静默丢数据。宁可不去重也不猜
  - `knownKeys` 可从已有 NDJSON 读回（`readNdjsonKeys`），续采时挡住边界页重复
  - **NDJSON 而不是 JSON 数组**：进程被杀最多留下一个残缺末行，前面全部有效；
    JSON 数组写一半就是整个文件不可解析。`readNdjsonKeys` 跳过残缺行并**计数**，
    让调用方知道发生过
  - 批量写 + `close()` 必须冲干；`persist` 抛错时**先清空缓冲**，
    否则下次 flush 会把同一批再写一遍
  - `stats().duplicates` 直接暴露续采重叠量
  - `keyByFields` 要求显式列字段——全字段摘要会把易变字段算进去，等于不去重
- [ ] **真实存储适配** - 内存与 NDJSON 两个实现已就位，Postgres/SQLite 等
  由调用方按 `write/flush/close` 接口提供（刻意不内置 DB 驱动）

**状态**: ✅ Gate 5 核心边界完成（125 项测试）。剩余为上层编排能力，非边界问题。

---

## 九、实用性改进（非发布要求）

### 已完成 ✅（本轮新增）
- **能力探测三态** - `available` / `broken` / `reason`
  - 探针做真实冒烟测试，不只查 typeof
  - `preflightHostCheck()` 启动前置检查
  - `npm run capabilities` 输出当前宿主报告
- **Node 支持矩阵** - `NODE_SUPPORT_MATRIX`（24/22 supported，20/18.18 best-effort）
- **异步 ModuleLoader** - `src/engine/realm/module-link-strategy.js`
  - 屏蔽 `moduleRequests`/`linkRequests`/`instantiate`（24+）与 `link()`（18+）差异
  - `importUrlAsync()` 全版本可用；`importUrl()` 缺能力时抛错而非返回半初始化模块
  - 测试通过删除原型 API 模拟 Node 18–22，验证降级路径真实可用
- **宿主回退层** - `src/engine/compat/host-compat.js`
  - ArrayBuffer.transfer / structuredClone / asyncDispose / AbortSignal.timeout
  - 无法保证语义的情况显式抛错，不静默降级
- **CI 矩阵** - `.github/workflows/ci.yml`（Node 4 版本 + 2 后端）
- **engines 放宽** - `>=18.18.0`（原先锁死 24.11.0）
- **Node 18/20 真实验证通过** - 四版本全绿（当时各 283/283）
  - 插件 activate/dispose 迁至异步导入（25 个插件）
  - 同步回调改用 `preload()` + `importUrlSyncCached()`
  - 修复 `Iterator` 缺失导致 Node 18/20 bootstrap 崩溃
  - 修复异步链接的循环依赖与 referrer 解析错误
  - `npm run test:matrix` 本地复现 CI 矩阵
- **消除测试时序抖动** - script-injector 固定延时改轮询等待
- **测试异步等待治理**
  - 新增 `tests/helpers/async-wait.js`
  - `waitUntil()` / `waitForValue()` / `drainTasks()`
  - Evidence 动态脚本、root navigation、iframe teardown、document.write 等测试已迁移
  - window-client / ServiceWorker client / plugin 测试的单轮 0ms 等待改为多轮让位
- **固定等待卫生检查** - `tests/test-hygiene-test.js`
  - 禁止测试中新增超过 2ms 的裸 `setTimeout` 等待
  - 已验证临时违规能被检查捕获
- **让位定时器不许 unref**（本轮修复，**36 项测试因此从未真正运行过**）
  - `async-wait.js` 的 `sleep()` 写了 `timer.unref()`，注释理由是「避免拖住
    进程退出」——恰好把作用弄反了：让位期间它就是唯一该维持事件循环存活的句柄。
    unref 之后，只要此刻没有别的 refed 句柄，事件循环直接排空，
    promise **永远不 settle**
  - 症状：node:test 报 `Promise resolution is still pending but the event loop
    has already resolved`，整个文件被 `cancelledByParent`。
    `document-open`(10) / `page-lifecycle-events`(11) /
    `root-window-client-navigation`(7) / `script-injector`(8) 四个文件全灭
  - 用同一助手的其他文件却一直是绿的——差别只在「当时恰好有没有别的活动句柄」，
    所以它长期看起来像「那几个文件坏了」而不是「助手坏了」
  - **比失败更糟的是这种沉默**：一个断言从不执行，和它不存在没有区别，
    但它在计数里、在报告里、在你以为已经覆盖了的地方
  - 「拖住退出」的担忧本身不成立：每个 sleep 都被 await，时长 0–2ms
- **工具脚本的跨平台缺陷**（本轮修复，其中一个是**谎报通过**）
  - `audit:state` 用 `path.relative()` 的结果去比 `src/surface/api/` 前缀。Windows 上
    给的是反斜杠，前缀判断全部落空，审计报「0 项待迁移 / 0 项已审阅豁免」——
    看起来比真实情况更好。修好后立刻暴露 4 项豁免 + 1 项真实待迁移
  - 同一脚本 `execSync('ls src/plugins/*/index.js')`：依赖 POSIX `ls` 与 shell
    通配展开，Windows 上直接崩，连带 3 项断言变红。改用 `readdirSync`
  - 四个脚本 + 两个测试用 `new URL('..', import.meta.url).pathname`：
    Windows 上是 `/C:/...`，`path.resolve` 拼成 `C:\C:\...`，`spawnSync` 的 cwd
    直接 ENOENT——而报错显示的是 node.exe 的路径，看起来像「Node 装坏了」。
    一律改 `fileURLToPath()`（顺带解决路径含空格残留 `%20`）
  - 顺带删掉 `configureCSSPropertyNames()`：全仓零引用的注入口，
    却让 `let propertyNames` 被计成模块级状态。「看起来可配置但实际不可配置」
    比没有接口更容易误导
- **稳定性验证** - 791 项在 Node 18 / 20 / 22 / 24 四档全绿。
  实测方式是直接调 nvm 里各版本的 node.exe，不切换全局符号链接

### 未完成项
- [ ] **Backend 兼容性矩阵实际差异测试** - CI 已配置，缺针对性断言
- [x] **性能基准** - `npm run benchmark`（中位数 + p90，不报平均值）
  - 实测 Node 24：冷启动中位数 **487ms**（p90 584ms）、
    热复用单次 run **0.15ms**、Realm 创建+销毁一轮 **476ms**
  - 报中位数与 p90 而不是平均值：冷启动的偶发长尾（GC、文件缓存未命中）
    会把平均值拖得没有参考性
- [x] **内存泄漏测试** - 判据是「是否随轮次增长」而不是绝对值
  - 实测句柄数第一轮后稳定在 **6**（5 PipeWrap + 1 ProcessWrap）——那是池子
    保留的常驻子进程，**不是泄漏**。三组各 4 轮后 total 不再增长，
    RSS 60.3 → 60.7 → 60.7 MiB
  - 用 `process.getActiveResourcesInfo()` 而不是堆快照：确定性、不需要
    `--expose-gc`、不受 GC 时机影响
  - 另有一条断言证明 close 真的回收（三个沙箱同时开 vs 全部关闭后句柄数）
- [x] **并发压力测试** - 4 个沙箱并行创建后互不串味
  - 并行写入各自全局再并行读回、各自 `location.origin` 独立、
    单沙箱 32 个并发求值全部 resolve
  - 一条断言覆盖「失败的求值不污染后续」——错误处理不能把连接搞坏
- [ ] **性能预算的多版本/多后端基线** - 当前预算按 Node 24 + 默认后端实测
  设定（冷启动 3000ms 上限留了 6 倍余量）。Node 18/20 与 worker-thread
  后端的实际数字尚未采集
- [ ] **安全边界文档** - vm.Context、plugin、Evidence、Protocol 的信任边界
- [ ] **API 文档** - 完整的内部 API 参考
- [ ] **示例代码** - 常见场景的示例项目

**状态**: 按实际使用需求推进

---

## 十、架构完成定义（按 ADR-0001 修订）

### 路线决策：plugin 不追平 legacy

ADR-0001 已定案：`legacy` 与 `plugin` 是**并存的两个产品形态**，不是新旧替换。

| | legacy | plugin |
|--|--------|--------|
| 定位 | 完整兼容入口 | 按需最小组装 |
| surface | 全量 1234 全局 | 按 Profile 决定（fullPreset 205） |
| 默认 | 保持默认 | 显式选择 |

因此原门槛「plugin 覆盖追平 legacy」作废。`surface-coverage-gap` 已从
blocking 降级为 tracked——它记录一个预期的事实，保留登记只为监控差距
**意外扩大**。

### 新门槛：缺失能力可诊断（ADR-0002）

- [x] 未装载能力取值时给出含能力名和插件名的结构化错误
- [x] `typeof` / `in` 探测行为不变（不能让特性探测抛错）
- [x] 未知全局仍是原生 `ReferenceError`，不编造建议
- [x] 诊断可关闭（`removeCapabilityDiagnostics`）
- [x] 映射表从插件源码静态解析，不需手写清单
- [x] **登记缺口已补齐**：映射表 107 → 152 条，未登记 48 → 0
  - events +18（各类 Event + MutationObserver 系列）
  - performance +18（各类 Timing / Entry）
  - streams +8（Controller / Reader / Writer）
  - dom-core +1（`document` 实例）
  - `onmessage` / `onmessageerror` / `postMessage` 显式豁免：它们是 Window
    接口的成员属性/方法，浏览器里未设置时返回 `null` 而非未定义，装诊断会
    让 `if (self.onmessage)` 这类写法失败
- [x] 有测试锁定「插件提供的全局必须已登记或显式豁免」，防止再次漂移
- [x] 已接入 `createRealm()`：默认 `explain` 模式，可选 `strict`，可 `false` 关闭
- [x] explainer 惰性构建，不影响 Realm 创建时序

### 核心能力
- [x] Core 能在支持矩阵内创建和销毁基础 Realm
- [x] App 可以显式注册插件并输出稳定 lock plan
- [x] Window、iframe、Worker、ServiceWorker、Worklet 使用统一插件契约
- [x] 现有常用入口通过 legacy 保持兼容（legacy 不再以被取代为目标）
- [x] Evidence Loader 与 Core 解耦
- [x] reset、snapshot、dispose、超时、关闭不泄漏资源
- [ ] 目标脚本、插件、Core、Protocol、Collector 信任边界可测试

### 质量保证
- [x] Baseline 三项验收（bootstrap 顺序 / 完整 surface / observability）
- [x] Node 18–24 矩阵（四档 791/791）
- [x] 冷启动、内存、并发指标 - `performance-budget-test.js`（8 项）
  + `npm run benchmark`（中位数 + p90）。冷启动断言取三次采样的最小值，
  不取单次——单次测的是「此刻机器有多忙」
- [ ] reset 指标 - 未单独采集（冷启动/热执行/Realm 创建销毁已有）

---

## 十一、ADR 待决策清单（可延后）

按照 `docs/架构改造计划.md` 第 29 节，以下决策可在实际使用中逐步形成：

### 已完成 ✅
- **ADR-0004** 动态 iframe 的 `contentWindow` 时序（选 A：opt-in 预热池，默认 0）
- **ADR-0005** 机器相关值不进浏览器身份
  - 记录三次踩坑：WebGL renderer、hardwareConcurrency、CSS `fontFamily`
  - 推论：**每次扩大采集范围都要重新过一遍这个检查**，不能假设上次查过了
- **ADR-0006** 对等性检查分三层，各层职责不重叠
  - 含「登记表机制」与四条已知方法论陷阱
  - 后补的第四条轴（枚举顺序与 own-descriptor 形状）归在形状层里，不是新职责层
- **ADR-0007** 同源 `parent` / `top` 交出真实父 window（选 A + C）
- **ADR-0008** 顶层目录按职责容器归口
  - 26 → 8，含程序化迁移方式、7 处语义路径、在 `install-error-stack-guard` 上
    踩的那一次，以及三条「明确不做」

### Phase 1 (Core)
- [ ] SDK `apiVersion` 格式和兼容性检查
- [ ] Core SemVer 策略（私有项目可简化）
- [ ] Plugin lock 格式和签名（可选）
- [ ] Evidence Bundle canonical JSON
- [ ] Frame Protocol 表示格式（已隐式决策）

### Phase 2 (Plugin SDK)
- [ ] Node 18 ModuleLoader 实现策略（当前 Node 24）
- [ ] StateRegistry 容量和回收策略

### Phase 3-5 (插件和 Evidence)
- [ ] Protocol schema 和版本策略
- [ ] Collector credential/retry 边界
- [ ] `legacy-full` 维护策略

**状态**: 大部分已通过实现隐式决策，文档化可延后

---

## 十二、与真实 Edge 的对等性（新增）

Baseline 保证「NV8 自己前后一致」，抓不到「NV8 从一开始就和真实浏览器不一样」。
这一节是后者，当前基准结论来自**真实 Edge 152 实测**，不靠规范推断。

采集工具（headless Edge + `--dump-dom`，**不依赖 Puppeteer/CDP**）：

```
npm run fingerprint:collect   # 指纹字段（UA/brands/WebGL）
npm run fingerprint:globals   # 全局名 1239 项
npm run fingerprint:members   # 原型成员 8957 项
```

涉及 iframe 或跨页面的测量需要真实 origin —— `file://` 下每个文件是独立的
opaque origin，拿不到 `parent`。这类探针走临时本地 HTTP 服务器（仅绑
127.0.0.1，用完即关）。

### 已完成 ✅

**三层对等性检查**

| 层级 | 现状 |
|---|---|
| 全局名存在性 | 152 profile 覆盖真实 Edge 的 **100%**，**多出为 0** |
| 原型成员明细 | 969 原型中 969 个成员集完全一致，**多出为 0** |
| 行为 | 144 探针 / 16 类，已全部通过 |

**修掉的宿主特征泄漏（多出的东西比缺少更危险）**
- `AsyncIterator` —— Node 24 的 V8 特性，Edge 152 没有
- `webkitAudioContext` —— Edge 151 已移除的旧别名
- `NetworkInformation.prototype.type` —— Chromium 只在 Android 暴露
- `Event.prototype.isTrusted` —— `[LegacyUnforgeable]`，真实浏览器定义在
  **实例**上且 `configurable: false`，不在原型上

**指纹字段**
- UA 缺 `Edg/` 后缀、brands 顺序与名称错误、build 号编造（Edge 与 Chromium
  build 必须不同）、`edge-runtime-options.js` 校验与 profile 自相矛盾
- WebGL **masked/unmasked 混淆**：`gl.VENDOR`/`gl.RENDERER` 是 Chromium
  固定值 `"WebKit"`/`"WebKit WebGL"`，GPU 信息只走
  `WEBGL_debug_renderer_info`。原实现把 GPU 串放在 masked 参数上
- GPU 身份组合库（`src/infra/fingerprint/gpu-profiles.js`）：5 套真实桌面 GPU，
  字段由「厂商+型号+驱动」推导而非手写，`validateGpuIdentity()` 挡住
  「WebGL 说 NVIDIA、WebGPU 说 Intel」这类矛盾

**事件处理器**
- `el.onclick = fn` / `document.onclick = fn` **完全不参与派发**（只是存储）。
  window 的早已接好，element 和 document 漏了
- `<div onclick="...">` 内容属性不编译成函数
- 按规范实现为「注册一个稳定的代理监听器」，重新赋值**不改变位置**

**生命周期事件派发目标**（真实 Edge 实测）
```
页面加载:      ["document:DCL", "window:DCL", "window:load"]
iframe 内导航:  ["window:beforeunload", "window:pagehide", "window:unload"]
```
- `load` 曾额外补派到 document —— 真实浏览器里 document 监听器从不触发
- `pagehide`/`unload` 曾**只**在 document 派发 —— 两侧都反了
- `document.close()` 兜底路径：DCL 缺 `bubbles`，`load` 派在 document

**beforeunload 三条异议路径**

实测（真实导航的处理器内）：
```json
{ "before": false, "afterAssign": false, "afterPreventDefault": true, "returnValue": "stay" }
```
赋值 `returnValue` **不会**置 canceled 标志 —— 浏览器在派发结束后单独检查。
因此判定放在决策点 `dispatchBeforeUnload()`，塞进 setter 会让
`defaultPrevented` 说谎。`onbeforeunload` 返回的字符串要写进 `returnValue`。

**事件构造器可构造性**

逐个 `new` 测 25 个 longtail 事件构造器，真实 Edge 有 8 个抛
`TypeError: Illegal constructor`。已封锁 7 个。

### 行为层对等性 ✅ 首轮已建立

方法论：探针定义放在 `src/infra/baseline/behavior-probes.js`，采集脚本与测试
**共用同一份**（各写一份必然漂移）。准入条件三条：跨运行确定、与机器无关、
可序列化。因此只取引擎固定产出的「结构性事实」——报错类型与文案、
`toString` 形态、类型标签、非法接收者行为，不取 CPU 核数/屏幕/时区。

采集：`npm run fingerprint:behavior`（跑两轮并要求逐字一致，探针本身在抖
就直接失败，不等到比较阶段）。

首轮 33 个探针 → **15 项不一致**，已全部修完（现 33/33 一致）：

**一、legacy 模式完全没有原生函数伪装**（5 项，最严重）

`setNativeFunctionContext` 只有 webidl 插件会调用，legacy（默认模式）
从未建过上下文。后果是所有 `registerNativeFunction` 永久滞留在队列里、
`Function.prototype.toString` 从未被接管：

```
Function.prototype.toString.call(document.addEventListener)
  真实: "function addEventListener() { [native code] }"
  修复前: "call(...args) { return invoke(this, args); }"
```

这是最经典的检测手法。同一个根因还让访问器的 `name` 是 `get value`
而非 `get readyState`。修法：legacy bootstrap 最先调用
`establishNativeFunctionContext()`，冲刷模块求值期排入的注册队列。

**二、WebIDL 实参个数完全不检查**（6 项）

`document.addEventListener()` 静默返回 undefined，真实浏览器抛
`Failed to execute 'addEventListener' on 'EventTarget': 2 arguments
required, but only 0 present.`。新增 `requireArguments()` 助手，文案按实测
模板（注意单复数：1 个是 `argument`）。

**三、构造器报错文案**（4 项）

- `Please use the 'new' operator` 缺后半句
  `, this DOM object constructor cannot be called as a function.`（38 处）
- `Illegal constructor` 缺 `Failed to construct 'X': ` 前缀（244 处单行构造器）
- **`new Document()` 在真实浏览器里允许**，NV8 抛 Illegal constructor。
  实测它构造一个空 XML 文档：`contentType: "application/xml"`、
  `URL: "about:blank"`、`readyState: "complete"`、无 documentElement、
  原型是 `Document.prototype` 而非 `HTMLDocument.prototype`

测试 14 项（`tests/edge-behavior-parity-test.js`），按分类切分断言，
一类整体退化时报错能指出是哪类行为坏了。已用「撤掉原生函数上下文」自验：
3 项按预期失败。

### 未完成项
- [x] **实参个数检查已成体系** - 下沉到 `definePrototypeMethod` /
  `defineGlobalFunction` 两个唯一入口
  - 关键是找到可靠的必需参数信息源：WebIDL 里方法的 `length` **就等于**必需
    参数个数。采集真实 Edge 全部 3496 个方法的 length 与 NV8 对比，
    **3476 项全部一致**，所以不需要在 757 个调用点手写个数
  - 抽样 12 接口 / 119 方法逐字对比报错文案：**119/119 一致**
  - 两个错误假设被实测纠正：(1) 按裸方法名排除 `forEach` 是错的——只有
    `DOMTokenList.forEach` 是 JS 风格报错，`URLSearchParams.forEach` /
    `Headers.forEach` 反而走 WebIDL 模板；(2) 返回 Promise 的操作
    （`hasPrivateToken` 等）参数错误转为 rejected promise，不同步抛
  - 全局函数另有 `on 'Window'` 后缀；`atob`/`btoa`/`structuredClone`
    原本各自手写截断文案
  - `npm run fingerprint:lengths` 采集 length 基准
- [x] **13 个缺失原型成员已补齐** - 151 profile 下 **963/966 原型完全一致，
  缺失 0，多出 0**
  - 其中 4 项**本来就实现了**，只是被 `edge151Surface` 门控，而当时的对比用的是
    150 profile：`AnimationEvent.animation` / `TransitionEvent.animation` /
    `PerformanceEntry.navigationId` / `WheelEvent.momentum`。
    把对比基准改成 151 profile 后，「陈旧条目」检查立刻把这 4 条揪了出来——
    这正是登记表机制该有的作用
  - 其余 9 项按真实 Edge 实测的 descriptor 形状补齐：
    `Blob/Request/Response.textStream`（**方法**而非访问器，产出字符串块的
    ReadableStream）、`Element/ElementInternals.ariaActionsElements`、
    `SpeechRecognition.unspokenPunctuation`、
    `WebTransportDatagramDuplexStream.incoming/outgoingMaxBufferedDatagrams`
  - 顺带修掉一条**影响全部 7 个 `aria*Elements`** 的偏差：属性不存在时真实
    Edge 返回 `null`，NV8 返回空数组。实测四种情形：属性不存在 → null，
    属性存在但解析不到 → array(0)，可解析 → array(1)，空字符串 → array(0)
- [x] **Node 18–22 的内建 shim 与原生对齐** - 四档 surface 现在完全一致
  - `SuppressedError` / `DisposableStack` / `AsyncDisposableStack` /
    `Float16Array` / `DataView` 的半精度方法都是 V8 13（Node 24）才有的，
    18–22 走 `install-modern-builtins.js` 的 shim。五处 shim 全都和原生不一样：
  - **`DisposableStack.prototype` 多出字符串键 `"undefined"`**（最严重）：
    `Symbol.dispose` 在 Node 20 以下不存在，`[Symbol.dispose]() {}` 的计算键
    被 ToPropertyKey 转成字符串 `"undefined"`。多出的成员是宿主特征泄漏，
    比缺少成员危险。同时符号键少两个（`Symbol.dispose` 与 `Symbol.toStringTag`），
    `Object.prototype.toString.call(stack)` 退回 `[object Object]`
  - `SuppressedError` 的 `name` 写在构造器里（落在**实例**上），
    原型缺 `message` / `name`
  - `Float16Array.prototype` 少 `BYTES_PER_ELEMENT`，却多一个显式的
    `Symbol.toStringTag`（真实的那个是 `%TypedArray%.prototype` 上的 getter）。
    取形状一致而牺牲了 `[object Float16Array]` 标签——形状进对等性比对，
    标签只在极少数探针出现
  - `DataView.getFloat16` / `setFloat16` 完全缺失。这两个**做真实的 binary16
    编解码**（Float16Array 只补形状）：DataView 的结果直接进协议字节，
    给近似值等于静默产出错误数据。舍入必须 ties-to-even，用 `Math.round`
    会让 2049 这类值错掉最后一位
  - shim 方法此前**全都没有原生伪装**：`DisposableStack.prototype.use.toString()`
    直接吐 JS 源码。已按原型逐个登记，`constructor` 用类名而不是 `"constructor"`
  - **一条推断被实测纠正**：以为符号键方法名带方括号（`[Symbol.dispose]`），
    在 Node 22 的 shim 上通过、Node 24 原生上失败——原生里
    `prototype[Symbol.dispose] === prototype.dispose` 是**同一个函数对象**，
    名字就是 `dispose`。同一张表跑两条路径才能发现，只测 shim 会把推断固化成契约
  - 修完后 `full-surface.json` 的 node18 / node20 / node22 三档对这五个全局的
    记录与 node24 **逐字节相同**（成员数、符号数、descriptor 摘要）。
    四档都用生成器在对应 Node major 上实跑，没有手抄
  - 测试 14 项（`tests/modern-builtins-shim-test.js`），刻意不分版本：
    同一张表在 24 上验原生、在 18–22 上验 shim
- [x] **Node 18 / 20 的引擎缺口已接入版本门控** - 四档从此全绿
  - 缺口清单（全部实测四档确认边界，不按 V8 版本推算）：
    `Array.prototype.toReversed/toSorted/toSpliced/with`、
    `String.prototype.isWellFormed/toWellFormed`、
    `RegExp.prototype.unicodeSets`、
    `ArrayBuffer.prototype.maxByteLength/resizable/resize`（以上 Node 20+）；
    `ArrayBuffer.prototype.detached/transfer/transferToFixedLength`、
    `Set` 的 7 个集合运算、`Iterator` 全局（以上 Node 22+）
  - 登记表放 `known-differences.js` 的 `NODE_VERSION_DEPENDENT_MEMBERS`，
    与 baseline 的 `expectedMissingForNode()` **共用同一份**：各写一份必然漂移
  - **ArrayBuffer 拆成两条条目**而不是合并：resizable 系列 Node 20 就有、
    transfer 系列要 21+。合并只能取最高门槛，于是 Node 20 上 resize/resizable
    明明该被解释却报成未登记
  - 记宽不会放过回归——这张表只在成员**确实缺失**时才被查询
  - 新增「登记表无死条目」断言：每条都必须在真实 Edge 里确实存在，
    否则一条写错原型名的条目会永远静静躺着，看起来像已经处理过
  - 为什么必须门控：永久红的断言和没有断言等价，很快会被学会忽略，
    真正的回归也就跟着被忽略
- [x] **`in` 在 Node 22 之前会触发 getter** - 根因定位并登记
  - `capability-diagnostics` 的 `strict diagnostics are non-enumerable`
    在 18/20 上红。原以为是 `Object.keys` 调了 getter，实测是
    **`'document' in globalThis`** 调了
  - 根因：`vm` 直到 Node 22 才给 contextified global 接上
    `PropertyQueryCallback`，之前 `has` 查询是用 **getter** 实现的。
    实测 getter 调用次数：18.20.8 → 1、20.20.2 → 1、22.22.2 → 0、24.11.0 → 0
  - 影响不止诊断：特性探测 `'fetch' in window` 会触发 getter 副作用，
    trace 会记下一次从未发生的属性读取
  - 标志位 `HAS_VM_PROPERTY_QUERY_CALLBACK` 放 `host-compat.js`（源码里，
    测试引用），不在测试里重写一遍版本判断
  - **不用 Proxy 包 globalThis 抹平**：代理对象自身的可检测面比这条差异危险
  - 测试按版本分支断言「会抛」而不是跳过：跳过等于在旧版本上放弃检查，
    而抛错本身也是确定行为，哪天变了应该被发现
- [x] **`BeforeUnloadEvent` 已封锁** - 8 个不可构造事件接口全部到位
  - 之前判断「封锁会让 beforeunload 取消整体失效」是基于一次失败尝试。
    正解不是找内部构造通道，而是**用本 Realm 的 `Event` 造实例**（肯定能被
    dispatch 认出），再把原型改成 `BeforeUnloadEvent.prototype`
  - 各接口的 `length` **逐个不同**（4 个是 2，4 个是 0），一刀切会改错一半
- [x] **legacy 模式导航已接 beforeunload 钩子** - 三条异议路径端到端可用
  - 迁移前 `bootstrap-root.js` 传空 options，`beforeNavigateHook` 为 null，
    `location.assign()` 只更新 URL 记录：既不派发 `beforeunload`，也不给页面
    取消导航的机会。真实浏览器里 `location.assign` 一定先派发 beforeunload
  - 钩子完全在 Realm 内完成，不需要宿主往返
  - 顺带修了 `configureNavigation` 无条件把钩子写成 null 的问题——调用顺序是
    realm-factory 先装、legacy bootstrap 后调无参版本，把钩子抹掉了
  - 取消时不派发卸载事件；继续时按序派发 `pagehide` → `unload`（都在 window）
- [x] **beforeunload 三条异议路径端到端验证** - 在 legacy 模式完成
  - `preventDefault()` / `returnValue = '非空'` / `onbeforeunload` 返回字符串
    均取消；`returnValue = ''` / 返回 undefined / 无处理器均继续
  - 只能在 legacy 跑：plugin 模式（含 `fullPreset`）不提供
    `BeforeUnloadEvent` 与 `onbeforeunload`，降级到普通 `Event` 后
    `returnValue` 是旧 IE 的**布尔**语义（赋 falsy 值 = preventDefault），
    与 beforeunload 的字符串语义正好相反
- [ ] **legacy 模式的整文档替换** - `beforeunload` 与卸载事件已就位，但导航
  通过后仍不替换文档（`location.href` 更新、DOM 不变）。需要让 legacy 子 Realm
  回调宿主替换文档，是独立的架构工作
- [x] **行为探针扩到 11 类 102 项** - 全部一致
  - 新增 `cssom`(22) / `canvas`(9) / `eventTiming`(9)。Canvas 与事件时序**本来就全对**；
    CSSOM 挖出 6 项不一致，已修
  - 刻意不测 `measureText` 字形宽度——取决于已安装字体，是机器指纹而非行为契约
- [x] **CSSOM 实现补齐** - 结构与原先的猜测完全不同
  - 实测：`CSSStyleDeclaration.prototype` 只有 **10** 个成员，
    745 个 CSS 属性是 **style 对象的自有属性**。装到原型上会让
    `edge-member-parity` 报 745 个多余成员。形状层看不到这个洞，
    正是行为层存在的意义（member parity 之前报 0 差异是**对的**）
  - 修掉 4 项：未设置属性读作 `""` 而非 `undefined`
    （`typeof el.style.display` 从 `'undefined'` 变 `'string'`，
    脚本里 `el.style.display === 'none'` 这类判断到处都是）、
    赋值同步 `cssText` 与 `style` 属性、computed style 赋值抛
    `NoModificationAllowedError`
  - 报错文案里属性名**出现两次**（`...therefore the 'color' property is
    read-only.`），不实测必漏
  - 745 个访问器按需安装，单个 style 对象实测 0.26ms
- [x] **计算值解析（UA 默认样式表）** - 40 个与布局无关的属性
  - 采集真实 Edge 94 标签 × 40 属性（`npm run fingerprint:ua-defaults`），
    生成「初始值 + 按标签差异」的数据模块
  - 基线取**未知标签**而不是众数：`unicodeBidi` 众数是 `normal`（50 次）但
    `isolate` 有 44 次，按众数会让 overrides 从 82 膨胀到 93 个标签
  - 颜色按浏览器语法序列化：`color: red` → `rgb(255, 0, 0)`、
    `#0f8` → `rgb(0, 255, 136)`、`rgba(1,2,3,0.5)` 原样保留 alpha
  - 游离元素所有计算值仍为空串（实测真实 Edge 如此），挂载后才解析
- [x] **计算值建模从 40 扩到 693 个属性** - 745 个中 **692 个**有值
  - 排除哪些属性靠**差分实测**而不是手写名单：同页面在 800×600 与 1400×900
    下采集（7 项随视口变化）+ 同视口下空 div 与填充内容对比（7 项随内容变化），
    并集 10 项。只做第一组会漏掉 `height` / `blockSize`——空 div 在两种视口下
    都是 0px
  - 剩余 53 个空值多数在真实 Edge 里也是空的（`@font-face` / `@counter-style`
    描述符没有计算值）
  - **差点烙进一个机器指纹**：首次采集把 `fontFamily` 记成
    `"Noto Sans SC"`——那是采集机器的中文系统语言决定的。实测
    `--lang=en-US` 给 `"Times New Roman"`，而 NV8 的 profile 声明
    languages 为 en-US，两边必须一致。采集脚本现在锁定 locale
- [ ] **布局相关计算值** - `width` / `height` / `blockSize` / `inlineSize` /
  `transformOrigin` / `perspectiveOrigin` 及其 webkit 版共 10 项需要布局引擎，
  刻意不建模（清单在 `css-ua-defaults.js` 的 `LAYOUT_DEPENDENT_PROPERTIES`）
- [x] **跨 Realm 对象身份探针** - 14 项，全部指向同一个根因
- [x] **动态 iframe 的 `contentWindow` 已可同步可用**（ADR-0004 定案：
      opt-in 预热池，默认关闭）
  - 定性纠正：这不是「指纹不对」而是**「跑不起来」**。反爬脚本「从干净 iframe 取
    原生函数」的写法是同步的，`contentWindow === null` 会让脚本在那一行抛
    TypeError，整个目标无法运行
  - **把 254ms 拆开是决策依据**：`createRealmShellAsync`（异步：模块图加载+链接）
    median 148ms、`activateRealmShell`（同步：337 个 install）median 106ms。
    所以只预热 shell 不行——`appendChild` 里仍要同步卡 106ms，而真实浏览器建初始
    about:blank 文档是**微秒级**。用一个可检测特征去修另一个可检测特征不值。
    预热**已激活**的 Realm 把开销全部前移到 `create()`：逆向场景里启动慢无所谓，
    运行时的时序异常才要命
  - 同一理由否掉原倾向里的选项 B（Node 24 同步 bootstrap）：同样是 106ms 同步阻塞，
    且「可观测行为随 Node 版本变化」与刚统一的四档 surface 方向相反
  - **上次回滚的根因由「默认关闭」直接解决**：那次池永远开着，池位与业务 Realm
    账目不分，59 项红。默认 0 意味着现有测试看到零个池位，实测 777 项四档全绿、
    默认路径一项没动
  - 池位**照旧占**堆额度并参与关闭清理（它们是真实 Realm、占真实堆），
    `readResources()` 增加 `idlePrewarmedRealms` 单列，于是
    「业务 Realm 数 = childRealms − idlePrewarmedRealms」仍答得出来。
    假装池位不占内存就是重犯刚修掉的那个「守卫算术与现实不符」
  - 池必须在**根 Realm 之前**填满：页面脚本在 `bootstrapRoot()` 内部
    （`parsePageHTML()`）就执行了。原 ADR 记的「池在 load 之后才填满、inline 脚本
    拿不到」正是这个问题
  - 池位以「自己是顶层」引导，被领走时由新增的 `reparentRealm()` 补父子关系；
    走 bootstrap 命名空间而不是 `importUrlSyncCached()`，不需要额外 preload、
    在 Node 18–22 上也不依赖同步模块链接
  - 开 `prewarmChildRealms: 1` 后 `realm/identity-bundle` 的 16 个子项与真实
    Edge 151 **逐字相同**。这验证了排序判断：ADR-0007 与 `frameElement` 必须先做，
    否则池落地了那条经典探针照样过不去（`parentIsUs` / `frameElementMatches` 靠
    那两轮）
  - 顺带纠正 ADR 里一处事实错误：原文说裸上下文会让 `contentWindow.Array` 为
    `undefined`——`vm.createContext()` 免费提供全部 JS intrinsics，缺的是 DOM 表面。
    选项 C 仍要拒，但理由是「`contentWindow.document === undefined` 比 `null` 是更
    强的信号，且表面随时间长出来是任何浏览器都没有的状态」
  - 测试 8 项（`tests/iframe-prewarm-pool-test.js`）
- [ ] **池深 N 只覆盖建 ≤N 个 iframe 的目标** - 超出退回原行为
  - 缓解不是根治。有专门断言把这条写死——以为「iframe 已经修好了」比知道自己在赌
    更危险
  - 默认配置（0）下 `contentWindow` 仍同步为 `null`，
    `edge-behavior-parity-test.js` 的两条登记差异保持不变
- [x] **子进程 SIGABRT 根因定位并修复** - `src/backend/controller/runtime-heap-floor.js`，
  6 项测试
  - 起因是那条被放过三次的偶发失败 `realm guard returns a structured error on
    child-process`。前几次归因"资源竞争"，这次**十路并发复现**（4/10 红），
    抓到真实错误 `SandboxChildExitError (signal=SIGABRT)`，
    再打开子进程 stderr 看到 `FATAL ERROR: Reached heap limit`
  - 根因：`limits.maxHeapBytes` 被同时用于**两件互不相干的事**——算 Realm 容量
    守卫，和设 V8 老生代上限。测试用 64MB 是为了触发守卫，但 64MB 老生代
    **不够引导一个完整 Realm**（337 个 install）
  - **V8 OOM 进程内拦不住**：abort 之后没有 JS 能再运行，所以永远不可能变成
    结构化错误。只能保证配置不会低到崩
  - 实测地板（Node 24，各 6 次并发）：32MB **0/6**、48MB **0/6**、
    64MB **5/6**（悬崖边，"偶发"的真身）、80MB 6/6、96MB 6/6、128MB 6/6。
    原地板 `Math.max(32, ...)` **保证崩溃**
  - 取 128MB（实测可用 80MB 的 1.6 倍）：贴着可用值取会把"必崩"换成"偶崩"，
    偶崩更难查
  - **抬高 V8 上限不削弱守卫**：两个用途走不同路径——`heapSafeRealmLimit` 用
    配置值算（`floor(64/36)=1`），V8 上限用钳制后的值。`LIMIT_HEAP_BYTES`
    照旧返回，只是子进程不会在返回它之前先崩掉
  - 三个后端入口（`child-process` / `worker-thread` / `worker-thread-pool`）
    统一走同一地板
  - 验证：修复前十路并发 4/10 红，修复后 **10/10 绿**
- [x] **堆容量守卫放行数超过堆能装下的数量已修**（原记录两次定性都不准）
  - 原记录说「8 个 iframe 全部建成且没有任何结构化错误」，也说「默认 512MB 下
    8/12/20 全部正常」。本轮按 `maxHeapBytes` × iframe 数做了完整扫描，
    两条都不准确——低堆下不是「建成后 close 才崩」，而是**建的过程中就
    SIGABRT**（code=134，连 `close()` 都跑不到）：

    | maxHeapBytes | 实测安全上限 | 原守卫放行 | 结果 |
    |---|---|---|---|
    | 128MB | **1** | 2 | SIGABRT |
    | 256MB | **5** | 6 | SIGABRT |
    | 512MB（默认）| 11 | 11 | 正常 |

  - 根因不是「守卫没拦住」（`reserveRealmCapacity()` 确实被调了），而是**守卫的
    算术偏大**：`floor(maxHeapBytes / 36MB)` 把根 Realm 也按 36MB 算。
    根 Realm 更贵——`runtime-heap-floor.js` 早就实测出单个 Realm 引导在 64MB 上
    5/6 成功、80MB 上 6/6
  - **512MB 没崩是被 `limits.maxRealms`（默认 12）挡住的，不是堆估算起了作用。**
    也就是说堆估算在所有实测档位上都偏大，只是默认配置恰好被另一个上限救了
    ——这类「靠别处的上限兜住」的正确性最容易在调参时消失
  - 修法：`floor((maxHeapBytes - 90MB) / 36MB)`，90MB 是根 Realm 基线。
    三个实测档位下给 1 / 4 / 11，都不超过安全上限；**默认 512MB 的行为不变**
    （收紧公式不能顺手改掉默认配置下的能力）
  - 宁可保守一个：多放行一个的代价是 SIGABRT，少放行一个的代价是一个结构化的
    容量错误。两者不对称
  - 修后重扫 128 / 256 / 512MB × 2 / 5 / 6 / 12 共 12 种组合，**无一崩溃**
  - 测试 6 项（`tests/realm-heap-capacity-test.js`）：公式层三个档位不得超过实测
    安全上限、不得保守超过 1 个、默认档行为不变、单调性；端到端一项验证低堆下给
    结构化拒绝而不是崩
- [ ] **容量拒绝在 iframe 上派发 `error` 事件** - 真实浏览器的 iframe 导航失败
  从不派发 `error`（见本节前文）。容量拒绝是 NV8 内部条件、没有浏览器对应物，
  但派 `error` 仍是可检测的：脚本连建多个 iframe 就能看到。宿主侧目前也看不到
  结构化错误（拒绝在 Realm 内被消化）
- [x] **`parent.document` 静默返回子文档已修**（ADR-0007 选 A + C）
  - 症状（修复前，在子 Realm 内部实测）：

    ```
    parent.document has parent-only      false   真实: true
    parent.document has child-only       true    真实: false
    parent.document === document         true    真实: false
    ```

    同源子帧里 `parent.document.*` 读到的是**自己的**文档。不报错、不为 null，
    返回一个形状完全正常的 `HTMLDocument`
  - 根因：`Object.create(parentWindow)` **不是可用的跨 Realm 委托机制**。
    实测普通数据属性沿原型链委托成功，而 `document` / `location` 这类由
    contextify 拦截器支撑的访问器**不跟随原型**，会落回访问方所在 Realm 的全局。
    facade 只忠实暴露它自己那三个属性，其余一切静默降级
  - 从逆向角度这条是决定性的：反爬 SDK 与验证码组件**故意**跑在 iframe 里
    （为了拿干净 intrinsics），然后回头读 `parent.document.referrer` /
    `parent.location.href` / `parent.document.cookie`，这些经常直接进签名
    payload。读错了脚本照样跑完、照样吐出格式正常的 token，只是算错了输入
    ——本地零信号，只在服务端被拒
  - 修法：同源分支直接交出真实的父 global，删掉 `createSameOriginParentFacade()`
- [x] **同源 `parent` / `top` 身份 4 处已修**（同上一条同根）
  - `parent === window`、`top === window`、`parent.window === parent`、
    `parent.self === parent` 现在全为 true
  - 定案时补的一条实测把这条的权重降下来了：**在子帧内部，最常见的嵌入检测本来
    就是对的**（`top !== self` / `parent !== window` / `parent === self` /
    `frameElement` 全对）。那 4 处只在**父侧**可见
    （`f.contentWindow.parent === window`），是罕见得多的写法。
    指纹价值不高，真正的风险是 `parent.document`
  - `tests/iframe-realm-test.js` 原先断言 `parent === window` 为 **false**
    ——**测试固化了缺陷**，已改成 `true`
- [x] **`event.source` 用 incumbent 近似补回**（选项 C，约 20 行）
  - 只做 A 的话必须把两条**正确的**断言（`event.source` 必须是子窗口）改成登记的
    已知差异——削弱正确的测试来迁就实现。C 做了就不用削
  - 机制：`parent` 在子 Realm 里是 getter，`parent.postMessage(x, '*')` 是单个
    表达式，getter 与调用之间插不进其他 Realm 的代码（单线程），所以 getter 顺手
    登记「现在是我」，父侧消费一次即清 + 微任务末清空
  - `notifyIncumbent` 挂在 `parentPostMessage` 函数对象上随同一条通道下发，
    避免往 `bootstrapRoot()` 的 40+ 个位置参数里再穿一个
  - **最初设想的 A′（把 `event.source` 置 null 让错误变响）不成立**：父窗口自发
    `window.postMessage()` 的 `source === window` 是**正确**的，无条件置 null 会
    弄坏一条本来正确的路径。A′ 塌进了 C
  - 测试只锁**方向安全**（一个子帧的消息永不记到兄弟头上），刻意不锁别名写法退化
    到哪个具体值——那取决于微任务与宏任务的相对时序
- [ ] **`event.source` 在别名跨任务写法下仍退化**
  - `const p = parent; setTimeout(() => p.postMessage(...))` 会退化成父窗口自己
  - 退化方向安全（不会记错兄弟），但不精确。要精确需要真正的 incumbent 栈，
    依赖宿主侧介入，与 ADR-0004 的池位账目是同一类架构工作
- [x] **`window.frameElement` 已实现**（legacy 模式）。原先是硬编码 `() => null`
  - 这不只是「少一个值」：广告与反爬代码常用它判断「我是不是被嵌在别人页面里」，
    恒为 null 等于声称自己是顶层窗口，而同时 `parent !== window`
    ——**两个信号自相矛盾**，比单独一处错更容易被识别
  - 返回的是**父 Realm 的 DOM 对象**，这是正确的：真实浏览器里该元素属于父文档，
    所以子 Realm 里 `frameElement instanceof HTMLIFrameElement` 为 false、
    `instanceof parent.HTMLIFrameElement` 为 true。这条容易被误当成 bug 而
    「修」成子 Realm 的对象——那才是偏差
  - 跨源一律 null（规范要求），且在**源头**就不传：子 Realm 连引用都拿不到，
    否则顺着 `ownerDocument` 就能读父文档
  - plugin 模式刻意不接：那一档的 Window 表面里压根没有这个访问器
    （surface fixture 的 plugin 档是 ABSENT，按 ADR-0001 是按需组装的结果）。
    加一个必然无效的配置调用就是「看起来可配置但实际不可配置」
  - 测试 4 项（`tests/iframe-frame-element-test.js`）
- [ ] **空白 iframe 的 `location.href` 不是一行改动**（重新定性为 origin/URL 解耦）
  - 原以为把 `html-iframe-element-realm-state.js` 里的默认 URL 从
    `parentPageUrl` 改成 `about:blank` 就行。前置条件（URL 支持 opaque path）
    已完成，但真正的障碍在别处：**NV8 目前把文档 origin 从页面 URL 推导出来**，
    而 `about:blank` 是第一个 URL 与 origin 必须分离的场合
    （URL 不透明、origin 继承父页面）
  - 至少四处要解耦：宿主侧 `runtime-pool` 用 `pageUrl.origin` 当 localStorage 键 /
    网络记录器 / broadcast 连接器；Realm 内 `configureNavigation(pageUrl)` 决定
    `location.origin`、`configureWindowMessaging(new URL(pageUrl).origin, ...)`
    决定 postMessage 的 origin
  - 直接改会让 `childOrigin` 变成 `"null"`，`current.sameOrigin` 判假，
    同源 iframe 退化成跨源门面——把一处 href 偏差换成整条同源链路失效
  - 实测确认当前 `origin` 是**正确继承**的，所以改 href 时不能改坏它
  - 顺带发现同一处的第二个偏差：`srcdoc` iframe 的 `href` 真实是
    `about:srcdoc`，NV8 也给父页面 URL
  - 结论：这是一次 origin/URL 解耦改造，应当单独立项
- [x] **采集脚本已能在原生 Windows 直接跑** - 7 个 collector 原来只列了
  WSL(`/mnt/c`) 与 Linux 的 Edge 路径
  - `collect-edge-lengths.mjs` 更糟：路径**直接写成 `execFile` 的第一个实参**，
    连候选列表都没有。补 `findEdge()` 时才发现
  - 「基准跟随本机 Edge」要成为常规做法，就不能依赖每次手动 `--edge`
- [x] **换基准到本机 Edge 152** - 采集、实现、测试和文档均已完成
  - 7 份 fixture 全部重采并作为 Edge 152 对等性基准：

    | 维度 | 151 | 152 | 变化 |
    |---|---|---|---|
    | 全局名 | 1236 | 1239 | +3：`NodeRange` `OpaqueRange` `PermissionsPolicy` |
    | 原型 / 成员 | 966 / 8941 | 969 / 8957 | +6 成员，**−2** |
    | 方法 `length` | 3496 | 3508 | 已有方法**零变化** |
    | 行为探针 | 144 | 144 | **零变化** |
    | CSS 属性 | 746 | 746 | 无 |
    | UA 默认值 | 96 标签 | 96 标签 | 无 |

  - 新增成员：`ShadowRoot.referenceTarget`、`Navigator.cpuPerformance`、
    `HTMLTemplateElement.shadowRootReferenceTarget` / `shadowRootSlotAssignment`、
    `HTMLInputElement.createValueRange`、`HTMLTextAreaElement.createValueRange`
  - **移除**成员：`AbstractRange.startContainer` / `endContainer`（移到新的
    `NodeRange`）。这两个要按 `< 152` 门控，不是删掉
  - **brands 不只是版本号变了**：GREASE 品牌串与数组顺序都变
    （`Not=A?Brand/99` → `Not?A_Brand/24`，Chromium 排到第一）。这类字段必须照抄，
    按规律推导会错——ADR-0005 同一条铁律
  - **行为层零变化**是个好消息：探针可以跨 major 迁移，扩探针不必等特定版本
  - **架构阻塞已解除**（见下一条）。换基准现在是三步：
    `npm run fingerprint:globals` → `build-window-surface-order.mjs --write`。
    已用真实 Edge 152 做过 dry-run：3 个新增全局自动带上形状、门控保留、
    1178 项表面顺序已与真实 Edge 152 逐字一致
  - `HTMLUserMediaElement`、`NodeRange`、`OpaqueRange`、`PermissionsPolicy` 和六个
    152 新增成员均已实现，并由 `tests/edge-152-surface-test.js` 覆盖
- [x] **全局的版本门控能力已做出来**（原架构阻塞）
  - `finalize-window-surface-order.js` 从 1.5 万行生成代码（638KB）改成
    **数据表 + 45 行解释器**（`window-surface-order.js`，1178 项）。
    生成它的工具 `tools/generate-window-surface-order.mjs` 从来没进版本库
  - 门控是一个字段：`{ since: 151 }` / `{ before: 152 }` / `{ pending: "理由" }`。
    `pending` 是「已登记缺口」的**单一来源**——`edge-surface-parity-test.js` 与
    `edge-member-parity-test.js` 都从表里读，不再各自维护名单（原来同一份账目
    抄在三处）
  - 校验脚本 `scripts/build-window-surface-order.mjs`（`npm run check:surface-order`）：
    顺序权威来源是 `fixtures/fingerprint/edge-globals.json`，形状来源是同一份
    fixture 新增的 `descriptors` 字段，门控从现表按名字继承。
    fixture 里少了一个已有全局会**报错**而不是静默删除
  - 实测收益不在性能（冷启动 414ms → 410ms，在噪声内），在于顺序整表可替换：
    151 → 152 有 **9 个已有全局挪了位置**，换基准必须整表重采，而这在 1.5 万行
    代码里等于重新生成整个文件
- [x] **`FontFaceSet` 在 151 profile 下错位已修**
  - 它只在 `browserMajorVersion >= 151` 暴露，而旧实现表达不了门控，于是落在
    **索引 61**（紧随 V8 内建之后），真实 Edge 是 **517**——其后 1171 个全局的
    索引全部偏移一位
  - **只测默认 150 profile 永远是绿的**（150 下这一项本来就不该存在）。与 `Intl`
    默认 locale、UA 默认字体族是同一类陷阱，所以新测试同时断言 150 与 151
- [x] **`window.chrome` 的 `configurable` 已按实测改**
  - 旧生成文件把它写成 `configurable: false`——1171 项里唯一的不可配置数据属性。
    实测真实 Edge 152 是 `true`，且 WebIDL 没有任何机制产生不可配置的数据属性
    （`[LegacyUnforgeable]` 产生的是访问器）。孤例 + 无规范依据 + 实测反证
  - 后果不是形状好看不好看：`delete window.chrome` 返回 false、
    `Object.defineProperty(window, 'chrome', …)` 抛 TypeError——而改写
    `window.chrome` 正是反爬脚本常做的事
- [x] **`InteractionContentfulPaint` / `PerformanceSoftNavigation` 已实现**
  - 构造函数早就在 `performance-longtail-runtime.js`，缺的是 6 个原型成员与接线。
    继承链、`length`、`toStringTag`、`prototype` descriptor、非法构造/调用文案
    全部按真实 Edge 152 实测值对齐
  - 成员安装顺序按真实原型枚举顺序接线（`constructor` 夹在中间，不是排末尾）
- [ ] **Node 18/20 上全局枚举顺序做不到与真实 Edge 一致**（宿主级，新发现）
  - V8 10.x / 11.x 在 dictionary 模式的 global object 上把**可枚举键排在不可枚举
    键之前**，不按插入序，违反 `[[OwnPropertyKeys]]`。V8 12.x（Node 22）已修正
  - 实测后果：238 个全局排到 V8 内建之前，`window` 落在索引 0 而真实 Edge 是 678。
    **旧实现同样如此**，只是从来没有测试看这一维
  - 不可绕过：`enumerable` 本身是要复现的契约值，不能为了顺序去改。裸 vm context
    上的最小复现已做（定义一个可枚举属性就会把它排到 `Object` 之前）
  - 已做成宿主能力探针 `vm.global-property-order`（报 `broken`），
    `npm run capabilities` 可见；`NODE_SUPPORT_MATRIX` 的 notes 也已写入。
    测试用**反向断言**豁免——宿主哪天修好了会红，逼人删掉豁免
  - 结论写进 README「环境要求」：**指纹敏感场景请用 Node 22+**
- [ ] **Node 18–22 的 V8 内建段顺序与 Chromium 不同**（宿主级，新发现）
  - TypedArray 家族的组内次序：V8 12.4 是
    `Float32 Float64 Uint8Clamped BigUint64 BigInt64`，Chromium 152 是
    `BigUint64 BigInt64 Uint8Clamped Float32 Float64`
  - `Iterator` 的位置：V8 12.4 在 `console` 之后（索引 60），Chromium 与 Node 24
    在 `Set` 之后（44）
  - 那 61 项不由 NV8 安装也不由它重排。抹平需要把重排起点从 `Option` 前移到
    TypedArray 段；**整段重排做不到**——`undefined` / `NaN` / `Infinity` 不可配置，
    删不掉。已在 `window-surface-order-test.js` 登记，Node 24 逐位一致
- [x] **原型成员的枚举顺序已对齐**
  - 将采集器改为保留真实 `Object.getOwnPropertyNames()` 顺序；Edge 152 fixture
    现包含 969 个原型的原生顺序。
  - 对比确认 27 个原型存在实现顺序差异，新增
    `src/surface/install/prototype-surface-order.js`，在所有表面安装完成后按
    descriptor 原样重排；其余原型保持原安装路径。
  - `tests/prototype-order-parity-test.js` 对 27 个差异项逐项断言，避免只比较集合。
- [x] **`illegalConstructor` 对不带 `new` 的调用文案已对齐**
  - 真实 Edge：`new InteractionContentfulPaint()` 报
    `Failed to construct 'InteractionContentfulPaint': Illegal constructor`，
    而 `InteractionContentfulPaint()`（不带 `new`）只报 `Illegal constructor`。
  - 28 个 runtime 模块、273 个调用点均传递 `new.target`；
    `tests/illegal-constructor-parity-test.js` 覆盖 GPU、XR、IDB 和性能接口。
- [ ] **`illegalConstructor` 对不带 `new` 的调用文案多了接口名**（新发现）
  - 实测真实 Edge：`new InteractionContentfulPaint()` 报
    `Failed to construct 'InteractionContentfulPaint': Illegal constructor`，
    而 `InteractionContentfulPaint()`（不带 `new`）只报 `Illegal constructor`
  - NV8 两种都带接口名。这是全项目一致的既有行为（几百处调用点），
    修它要在 `illegalConstructor` 里区分 `new.target`，单独立项
- [x] **音频指纹探针已补**（14 项，第一梯队第一项）
  - 补之前**一个探针都没有**，而 surface 里 `AudioContext` /
    `OfflineAudioContext` / `OscillatorNode` / `AnalyserNode` / `AudioBuffer`
    全部齐备、descriptor 零差异。14 项里 **10 项不一致**——形状层完全看不到
  - 抓到的偏差：
    - `OfflineAudioContext.length` 读出 `undefined`（内部叫 `offlineLength`，没映射）
    - destination 是 `2|2|max`，真实是 `1|1|explicit`（跟随 `numberOfChannels`）
    - **五处报错类型错**：`RangeError` 而真实是 `NotSupportedError`（构造）/
      `IndexSizeError`（`fftSize`、`getChannelData`）。脚本按 `error.name` 分支，
      类型错比文案错严重
    - `sampleRate: 1` 被静默接受，真实抛 `[3000, 768000]` 越界
    - `new OfflineAudioContext(1)` 报 `length must be a positive integer`，
      真实走字典重载报 `not of type 'OfflineAudioContextOptions'`
    - `frequency.minValue/maxValue` 是 float32 极值，真实是 **±nyquist**
      （`sampleRate/2`）；`detune` 真实是 ±153600
    - **float32 加宽的小数展开**：`attack.defaultValue` 是 `0.003` 而真实是
      `0.003000000026077032`；`gain.minValue` 是 `-3.4028235e+38` 而真实是
      `-3.4028234663852886e+38`。根因是把 float32 极值的十进制**缩写**当 double
      字面量写死。正解是 AudioParam 一律 `Math.fround`——Chromium 里它是 float 存储，
      读出来是 float32 加宽成 double
  - **刻意不把渲染出来的样本值写成探针**：典型音频指纹是
    `OfflineAudioContext` → oscillator → compressor → `startRendering()` →
    buffer 求和取哈希，那条链的浮点结果可能随 CPU 的 SIMD 路径变化。按 ADR-0005
    机器相关的值不能进浏览器身份，也违反「跨运行确定、与机器无关」的准入条件
  - 采集在 Edge 152 上做的，**原 112 项零变化**（151 → 152 的行为层差异实测为 0），
    所以这次重采不构成版本偏斜
- [x] **Intl / 时区与 `performance.now()` 精度探针已补**（18 项，第一梯队剩下两项）
  - Intl 13 项、performance 5 项，抓到 4 处偏差，其中 2 处 NV8 自己的问题已修：
    - `Intl.v8BreakIterator` 报成「NV8 缺一个 Intl 成员」，实际是**测试用了默认
      150 profile 去比 151+ 的 fixture**——`browserMajorVersion >= 151` 门控的成员
      被误报成缺失。这正是「采集基准版本必须与 profile 一致」那个踩过两次的坑，
      `edge-member-parity-test.js` 早就显式传 151 profile 了，behavior 这份漏了
    - `performance.measure()` 对不存在的 mark 报错缺 Chromium 的
      `Failed to execute 'measure' on 'Performance': ` 前缀
  - 剩下 2 处是**宿主级差异**，已登记：
    - **ICU 数据版本**：Node 与 Chromium 各自打包 ICU。差异很窄——`NumberFormat` /
      `ListFormat` / `RelativeTimeFormat` / `PluralRules` / `Collator` /
      `Segmenter` 全部逐字一致，只有语言显示名不同
      （`zh-Hant` → 真实 `Chinese (Traditional)`，Node `Traditional Chinese`）。
      四档 Node 一致，所以宿主升级修不掉；要对齐得随 NV8 打包 Chromium 的 ICU 并
      接管整个 `Intl`，会打破零依赖
    - **V8 非法 locale 文案**：V8 13.x 改成 `Invalid language tag: !!`，
      四档 Node 都还是 `Incorrect locale information provided`。对齐需要包一层所有
      Intl 构造器并伪装 toString，代价大于收益
  - **`Intl.DurationFormat` 从成员表探针里剔掉**：它只在 Node 24 的 V8 里有。
    整份成员表混进一个宿主版本相关的名字，探针就会在四档 Node 里给不同结果，
    而行为层没有版本门控机制。剔掉后其余 12 个名字仍逐个受检
  - **两条采集纪律**（都靠实测定下来，不是推断）：
    - 每个 Intl 探针**显式传 locale**，不用默认 locale。采集器不传 `--lang`，
      默认 locale 会跟采集机的系统语言走——ADR-0005 的 `fontFamily` 就是这么中招的
    - **时区相关的输出一律不进探针**：实测 Chromium 在 Windows 上**不理 `TZ`
      环境变量**、只跟随操作系统时区（给采集器传 `TZ=UTC`，
      `resolvedOptions().timeZone` 仍是本机的 `Asia/Shanghai`），所以采集器锁不住。
      `new Date(0).toString()` 因此只探**形状**（正则匹配 + 段数）——第一版把偏移
      和时区名替换成占位符就以为够了，时间部分 `08:00:00` 仍跟着采集机时区走
  - `performance.now()` 的 100µs 钳制只报布尔，不报具体耗时——后者是机器性能
- [x] **`Intl` 的默认 locale 现在跟随 profile**（本轮实测发现并修复，比 fontFamily
  那条严重）
  - 修复前实测（Windows 中文系统）：profile 声明 `locale: en-US` /
    `navigator.language: en-US`，而

    ```
    Intl.DateTimeFormat().resolvedOptions().locale  → "zh-CN"   ← 宿主机器的
    new Intl.ListFormat().format(['a','b','c'])     → "a、b和c"  ← 宿主机器的
    ```

    也就是说 `Intl` 的默认 locale 来自**操作系统**，profile 完全不起作用。
    zh-CN profile 在本机「看起来对」纯属巧合——本机系统语言就是 zh-CN
  - 两层后果：**内部矛盾**（`navigator.language` 与
    `Intl.DateTimeFormat().resolvedOptions()` 是最常一起被读的一对）；
    **身份随机器变**（同一 profile 在中文机与英文机上给出不同身份），
    与 ADR-0005 铁律直接冲突，和 `module-bundle.json` 那次「本机命中率恒为 0」
    是同一类错
  - 宿主侧改不了，逐个实测：`LANG` / `LC_ALL` 在 Windows 无效（仍 zh-CN）、
    没有 `--icu-default-locale`（`node: bad option`）、`vm.createContext()`
    无 locale 选项。所以只能在 Realm 内接管
  - `timezone` 本来就是对的（子进程 env 设 `TZ`，Node 认）——**只有 locale 漏了**
  - 实现：`install-intl-default-locale.js` 包装 9 个 `Intl` 构造器 + 8 个
    `toLocale*` 方法，**仅在调用方没传 locales 时**填入 profile 的
    `navigator.language`。判据是 `undefined`（规范里表示「用默认」），
    `null` / `[]` 是调用方明确给出的值，替换它就从「身份不一致」变成「功能错误」
  - 身份保全逐项验证：`name` / `length` / `prototype` /
    **`prototype.constructor` 回链**（不改这条
    `new Intl.NumberFormat().constructor === Intl.NumberFormat` 会变 false）/
    静态方法 / 原生 `toString`
  - **这一层不能靠行为探针验证**：探针期望值来自真实 Edge，而采集时真实 Edge 的
    默认 locale 就是采集机的系统 locale——拿它当基准等于把采集机 locale 写进契约。
    所以新增的是**内部一致性**测试（`tests/intl-default-locale-test.js`，5 项）：
    profile 声明什么，运行时就该是什么
  - 测试特意同时断言 zh-CN 与 en-US 两个 profile。单测一个的话，在与之同语言的
    机器上永远绿——正是这个 bug 藏了这么久的原因
- [x] **UA 默认字体族已跟随 locale**（原「profile 的 locale 与 UA 默认样式表
  自相矛盾」）
  - 修复前：`edge-150.js` / `edge-151.js` 都声明 `locale: "zh-CN"`，而
    `css-ua-defaults.js` 里 `fontFamily` 是 `"Times New Roman"`——**en-US** 的默认
    字体。于是 `navigator.language === 'zh-CN'` 而
    `getComputedStyle(document.body).fontFamily` 是英文值，一比就对不上
  - README 记的是反向的那次修复（「采集机的中文系统语言混进默认样式表，而
    navigator.language 声明 en-US」）。但 profile 实际写的是 zh-CN，所以当时把采集器
    锁到 `--lang=en-US` 是**制造**了矛盾——修了采集器没修 profile
  - **不用「选一个 locale」解决，而是让 locale 成为能切的一维**：使用场景里中文站点
    与英文站点都有，钉在任一个 locale 上，另一半目标就天天带着不匹配的
    `Accept-Language`
  - 逐 locale 实测（Windows 11 + Edge 152，headless）：

    | `--lang` | body fontFamily |
    |---|---|
    | en-US / en-GB / de-DE / ru-RU / **zh-TW** | `"Times New Roman"` |
    | zh-CN | `"Noto Sans SC"` |
    | ja-JP | `"Yu Gothic"` |
    | ko-KR | `"Malgun Gothic"` |

    `<pre>` 在八个 locale 下一律 `monospace`——标签级 override 与 locale 无关，
    所以覆盖只能作用于**基线**值
  - 三条结论决定了表的形状：拉丁/西里尔一律 `Times New Roman`；**`zh-TW` 也是**
    （所以不能按 `zh` 前缀一刀切，要最长前缀匹配）；ja / ko 拿到的是 Windows
    自带字体（Yu Gothic 随 Win8+、Malgun Gothic 随 Win7+），与机器无关
  - **`zh-CN` 那一项特意核查过是不是开发机产物**：`Noto Sans SC` 不是上古 Windows
    自带字体，但实测它在本机 `%WINDIR%\Fonts` 里
    （`NotoSansSC-VF.ttf`，Windows 11 的中文语言支持会装），而同目录下
    `simsun.ttc` / `msyh.ttc` 都在却**没被选中**——说明这是 Chromium 对 zh-Hans 的
    偏好顺序，不是「碰巧只有 Noto」。Windows 10 或没装中文语言支持的机器大概率会落到
    `Microsoft YaHei`，所以它是**可覆盖的字段**而不是硬编码，与 `gpu-profiles.js`
    同一个套路：值是**挑选**的，不是从开发机采下来就当真理
  - 实现：`src/infra/fingerprint/ua-default-fonts.js`（表 + 最长前缀查找 +
    `validateLocaleFontPair()`）；`css-computed-value.js` 加 per-Realm 覆盖，
    只改基线不动标签级 override。做成覆盖而不是重新生成 fixture，
    因为 fixture 只能存一个 locale 的值，而这一维是运行时可变的
  - 测试 6 项（`tests/ua-default-font-locale-test.js`）：查表最长前缀、
    配对校验能抓到不匹配与缺值、表项都是带引号的计算值形态、默认 profile 一致、
    切 locale 四档一起跟着切、`<pre>` 的 monospace 不被破坏
- [ ] **行为探针覆盖面仍是最大的缺口** - 当前 144 项 / 16 类，对 1239 全局 / 8957 成员
  - 已覆盖：`cssom` 22、`argumentCount` 19、`audio` 14、`intl` 13、`performance`、
    `crossRealm`、URL、事件时序和其他结构性行为
  - 仍缺少专门探针的领域：字体度量、DOM 遍历 / Range / Selection、fetch / XHR /
    WebSocket 语义、Storage、IndexedDB、Worker / ServiceWorker、Media、Web Animations、
    Observers、SVG、Crypto
  - **按「反爬真正读什么」排，不按未覆盖的表面大小排**。第一梯队已经完成音频指纹、
    Intl / 时区和 `performance.now()` 精度；下一轮应先评估字体度量与 DOM/Range 行为，
    而不是为了刷覆盖率平均给所有 API 加探针
  - 「形状层已经到顶」这个判断**已被推翻一半**：多余 0、缺失 0、969/969 原型成员
    集合一致都是真的，但那两个数字都只覆盖**集合**，不覆盖**顺序**与 window 自身的
    descriptor。新增第四层后首轮抓到 3 个真问题（`FontFaceSet` 错位、
    `window.chrome` 不可配置、Node 18/20 的顺序错乱），另外量出 27 个原型的成员
    顺序不一致；这 27 项现已由 Edge 152 专用顺序表校正。形状层还有没测过的维度，
    不是到顶
  - 行为层依然是发现真问题最多的地方。CSSOM 是证据：形状层报 0 差异是**对的**，
    行为层却查出 6 处
  - **换基准已完成**：本机 Edge 152.0.4191.53，fixture 和对等性测试均已切换到
    Edge 152；实测 151 → 152 行为层零变化，探针可以跨 major 迁移

**测试**：`tests/edge-surface-parity-test.js`(9)、
`tests/edge-member-parity-test.js`(10)、`tests/window-surface-order-test.js`(27)、
`tests/webgl-parity-test.js`(8)、
`tests/gpu-profiles-test.js`(13)、`tests/fingerprint-calibration-test.js`(12)、
`tests/event-handler-attribute-test.js`(14)、
`tests/lifecycle-event-targets-test.js`(13)、
`tests/edge-behavior-parity-test.js`(25)

**文档**：`docs/edge-parity.md`

---

## 十三、结构与卫生（全量扫描后的一轮收敛）

一次仓库级只读扫描（4251 个文件）出了一份清单，逐项核对后落地如下。**没做结构
重构**——barrel、测试分目录、大文件拆分的理由见本节末。
（**容器目录后来做了**，见下面「容器化重构（已落地）」。）

### 已修

- [x] **测试入口不再手写路径**。`package.json` 的 `test` 从 78 条手写路径改成
  `node --experimental-vm-modules --test`（无参数自动发现）。新增测试不注册就静默
  不跑，是「修掉沉默失效的 36 项测试」的同类隐患
  - 目录形式与 glob 形式在 Node 18/20 与 22+ 之间**不兼容**（前者只认目录、后者只认
    glob），无参数模式是唯一四档通用的写法。`test-matrix.sh` 也改成同一条命令
  - 代价是发现范围变成整个仓库，所以补了一条断言：**tests/ 之外不得有匹配 Node
    测试文件名模式的文件**（`tests/test-hygiene-test.js`）。自证过：往 `src/infra/utils/`
    扔一个 `stray-test.js` 立刻红
- [x] **两份手写测试改用 `node:test`**
  - plugin-sdk 那份（原在 `src/engine/plugin-sdk/`，住在产品树、`console.log` 分段、
    顶层断言、391 行）→ `tests/plugin-sdk-test.js`，16 项。断言逐条照搬
  - `tests/plugin-system-test.js`（15 个 `async function testXxx()` +
    `runTests()` 串行 + 自写 `assertEqual` + `process.exit(1)`）→ 15 个 `test()`
  - 两者原来都不在 `--test` 的计数里：791 项从来没包含它们的 26 段。而顶层断言
    意味着第一项失败后面全部不执行，一次只能看见一个问题
  - 顺带把 10 处内联的 silent logger 收敛成一个常量
- [x] **`plugins/canvas` 是空壳且谎报能力**
  - `install()` 里只有「Canvas 实现待补充」，却声明 `canvas.base`。实测加不加这个
    插件 surface 一模一样——纯死代码，而 ADR-0002 那套缺失能力诊断因此看不见这个洞
  - 根因是**装错了钩子**：三参数 `install()` 会被 `normalizePlugin` 判为 legacy，
    `installPlugin` 直接跳过（因为 `install-*` 操作宿主 globalThis，Realm 建立前跑
    会污染宿主进程）。真正装表面必须在 `activate` 里经 `moduleLoader.importUrlAsync`
  - 修复后 plugin 模式下：`typeof CanvasRenderingContext2D` 从 `"undefined"` 变
    `"function"`，`String(ctx)` 从 `"[object Object]"` 变
    `"[object CanvasRenderingContext2D]"`（两者都是可检测特征）
  - `reserveGlobalSurface` 必须逐个写**字面量**：`collectGlobalSurfaceMap` 靠静态
    正则扫这些调用，循环里的变量参数解析不到
  - `plugins/dom` 与 `plugins/html` 的空 `install()` 是**有意的聚合门面**
    （能力由 `dom-core` + `dom-collections` / `html-elements` 实际提供），不是同类问题
- [x] **`sandbox_manual.md`（1537 行）描述了一套不存在的 API**
  - `ExecutionCore` / `createExecutionCore` / `edgeCompatPlugins` /
    `edgeCompatProfile` / `resolvePluginPlan` / `assertPlugin` 全部不存在；
    四个 `nv8/` 子路径（`core`、`plugins`、`plugin-sdk`、`profiles`）也不在
    `exports` 里
  - 第 17 节描述了九阶段审计，用到 5 个 npm 脚本（`audit`、`audit:functions`、
    `test:core`、`test:phase1`、`benchmark:ips-threads`）——**一个都没有**，
    还配了一句「不要伪造或清空 evidence 来绕过门禁」
  - 全部改成实际存在的入口。`docs/evidence-contract.md` /
    `docs/node-compatibility.md` 里三处从 `nv8/` 的 `core` 子路径导入的示例同样修掉
- [x] **文档失步做成断言**（`tests/docs-contract-test.js`，5 项）
  - 扫全部 md，校验三类可机械核对的引用：`npm run <script>` 在 `scripts` 里、
    `nv8/<subpath>` 在 `exports` 里、`src|tests|scripts|docs|fixtures/...` 路径存在
  - `docs/架构改造计划.md` 显式豁免——它是**规划**文档，描述目标结构是它的职责。
    豁免理由写在测试里，并在该文档头部标明「这是规划，不是现状」
  - 豁免项自身有过时检查：一个「允许不存在」的路径如果其实存在，说明豁免过时了
- [x] **配置自相矛盾**
  - `package.json` description 是「Edge 150 Node.js compatibility sandbox」而代码/
    文档目标是 150/151 双 profile、fixture 基准 151、本机 Edge 152 → 改成
    `Edge-compatible browser runtime for Node.js (profiles: Edge 150 / 151)`
  - `exports` 只暴露 `./fingerprint/edge-150`，而 `edge-151.js` 存在且被测试用 → 补上
  - `package-lock.json` 的 `engines` 是 `24.11.0`（生成 lock 时 package.json 的旧值），
    与 `>=18.18.0` 矛盾 → 重新生成
  - `.node-version` 写 `24.11.0`，而本机 nvm 里根本没有这个版本 → 改成 `24`
    （major-only，工具自选最新 24.x）
- [x] **宿主层 5 处 `console.error` 绕过 logger**
  - `src/engine/core/script-injector.js` 4 处 + `src/engine/core/sandbox.js` 1 处。Core 层直接打
    stdout：调用方关不掉、诊断层收不到
  - `ScriptInjector` 加可选 `logger`；`injectEvidenceScripts` 把 sandbox 的 logger
    传进去。缺省 no-op，因为错误已经通过 `triggerErrorCallbacks` 与 `script.error`
    往上抛了一份
  - `src/engine/core/app.js` 与 `src/infra/utils/logger.js` 里的 `console.*` **是 logger 自身的
    实现**，不动。`src/surface/api/**` 里的 `console` 是 Realm 内的浏览器 console，也不动
- [x] **`eventListenerRegistry.js` → `event-listener-registry.js`**。全 src 唯一一个
  非 kebab 文件名，只有 1 处引用
- [x] **`.tmp-probe/` 进 `.gitignore`**。诊断时把真实 Edge 与 NV8 的输出落盘逐字比对
  会产生几百 KB 中间文件，属于当次调查
- [x] **`docs/架构改造计划.md` 的 `最后更新：2026-01-XX`**。`XX` 是字面占位符
- [x] **`docs/rust-migration-map.json` 的 `generatedFrom` 指向已删目录**。
  1465 条映射与 90 个 `implementationTarget` 全部有效，只是元数据没说清那个目录已经
  不在了

### 核对后判定为「不是问题」

- **`src/engine/core/sandbox.js` 用 `new URL('../install/...')` 引用上层**——清单判为
  「Core → 表面穿透」，实际是这套架构的**必要机制**：那些模块操作 Realm 的
  `globalThis`，必须由 Realm 自己的 moduleLoader 加载。改成静态 `import` 会把表面装到
  宿主进程。已在代码里写明理由
- **`src/` 里没有死文件**。对 4158 个文件做可达性分析（含 `new URL` + moduleLoader
  这条动态边），从测试/脚本/入口出发**全部可达**，0 个孤儿

### 容器化重构（已落地）

- [x] **26 个顶层目录 → 8 项容器**。`api/`(3680 文件) 与 `network/`(1 文件) 原来并列
  在顶层，分层意图只存在于阅读者脑子里
  - `engine/` = core / realm / bootstrap / webidl / plugin-sdk / compat
  - `surface/` = api（88 域 / 3680 文件）/ install（320 文件）
  - `config/` = profiles / presets
  - `backend/` = controller / child / thread / **protocol**
  - `collection/` = collector / **request-protocol** / evidence
  - `infra/` = baseline / fingerprint / navigation / network / scheduler / trace / utils
  - `plugins/` `public/` `index.js` 原位不动
- [x] **`protocol` 与 `request-protocol` 的命名混淆顺带解决了**：一个进 `backend/`
  （宿主↔子进程帧协议），一个进 `collection/`（请求计划与适配器）。它们从来不是
  一回事，以前并列在顶层只能靠记。对外导出仍是 `nv8/protocol` → request-protocol
- [x] **`plugin-sdk` 从 `core/` 提到 `engine/`**：它是横向能力，不属于 Sandbox 内核。
  README 原来就把它画在 `src/plugins/plugin-sdk/`，那个位置从来不存在
- [x] **执行方式**：全程程序化，没有手改 import
  - 24 次 `git mv`（保留文件历史）
  - 迁移器对 **2466 个文件、5244 处 specifier** 重算相对路径：在**旧文件树快照**里
    解析每个 spec → 映射到新位置 → 重算相对路径。重跑 dry-run 为 0 处待改，幂等
  - 46 处不可解析的按原样保留，逐条核对过：`fixtures/` 路径（不移动）、
    测试内动态生成的 fixture 模块（`./a.js` 之类磁盘上不存在）、
    以及 `new URL("./", script)` 这种运行时 URL 计算
- [x] **7 处语义路径手改**（它们不指向具体文件，迁移器解析不到）
  - `engine/realm/module-loader.js` 的 `SOURCE_ROOT`：模块加载器只放行这个前缀下的
    `file:` URL。`"../"` 在新位置是 `src/engine/`，会把整个 `src/surface/` 挡在外面
  - `engine/bootstrap/sanitize-stack.js`、`backend/controller/child-process.js` 的
    仓库根（`"../../"` → `"../../../"`）
  - `engine/core/capability-diagnostics.js` 读插件源码的候选路径
  - `engine/bootstrap/install-error-stack-guard.js` 的 `internalSourceRoot`
    ——**这处踩了一次**：原实现是 `import.meta.url.indexOf("/bootstrap/")` 字符串
    截取，我改成 `new URL("../../", import.meta.url)`，引导阶段直接
    `URL is not defined`。那个模块在 Realm 内求值，此刻 `hideNodeGlobals()` 已经删掉
    Node 的 `URL`、`installURL()` 还没跑。看似脆弱的字符串写法是**有意避开 URL
    构造器**的。现在按 `/src/` 定位，既不用 URL 也不依赖目录层数
  - `tests/evidence-contract-test.js`、`tests/protocol-artifact-test.js` 的目录形 URL
- [x] **配置与元数据同步**：`package.json` 的 4 个子路径导出、`.gitignore` 的
  module-bundle 路径、`build-module-bundle.mjs` 的入口与输出、`audit-module-state.mjs`
  的 5 个审计前缀与 4 条豁免键、`state-scope-test.js` 的 6 个被审计文件、
  `docs/rust-migration-map.json` 的 1465 条 `implementationTarget`、CI 注释
- [x] **文档同步**：14 份 md、120 处路径引用。规则是「映射后文件存在才改」——
  这自动区分了「现存文件的新路径」与「已删除对象的历史记录」
  （`src/core/test/*` 这类保留原样）。README 的目录树重画成带职责说明的容器视图
- [x] **结构守卫**（`tests/source-layout-test.js`，5 项）：顶层只允许声明过的 8 项、
  每项必须有一句职责说明、各容器只允许声明过的子目录，另外两条分层方向断言
  ——`engine/`（bootstrap 除外）不静态 import `surface/`，`surface/` 不 import
  `backend/` 与 `collection/`。自证过：新开一个顶层目录、或在 `engine/core/` 里
  静态 import `surface/install/`，立刻红
  - `bootstrap/` 是 engine→surface 的**唯一例外且必须是例外**：它就是「把表面装进
    Realm」这件事本身，而它自己由 moduleLoader 在 Realm 内加载
- [x] **验证**：861 项四档全绿；三份 baseline（bootstrap 顺序 340 步 / surface /
  observability）**全部一致**——重构没有改变任何运行时行为；`audit:state` 0 项待迁移；
  `check:surface-order` 一致；`build:bundle` 4010 个模块正常

### 明确不做（需要单独立项 + 你点头）
- **给 `src/surface/api/<域>`（88 个）与 `src/surface/install/`（320 个）补 barrel**。api/install 是
  生成体，barrel 与「是否生成」要一起决策，否则又多一类「声称生成却无生成器」
- **按域把测试分进 `tests/{core,api,collector,...}/`**。自动发现已经解决了「新增
  测试要注册」的问题，分目录只影响人找文件的路径
- **拆大文件**（`sandbox.js` 1903 行、`runtime-pool.js` 1563、`bootstrap-root.js`
  1469、`edge-runtime-options.js` 1419、`behavior-probes.js` 1290）。拆分边界要按
  职责切，不是按行数切；没有明确的职责边界之前拆只是把一个大文件变成一堆互相
  import 的小文件
- ~~**`protocol` 与 `request-protocol` 改名**~~ —— 容器化时**顺带解决了**：一个进
  `backend/`、一个进 `collection/`，容器名已经把它们分开，不必改名，对外导出
  （`nv8/protocol` → request-protocol）也不用动

---

## 总结与优先级

原来这一节列的三项「高优先级」（Protocol/Collector 边界、Evidence Loader 解耦、
默认模式切换）中，前两项已完成，第三项按 ADR-0001 **作废**（legacy 与 plugin
并存，不是新旧替换）。下面是按实际状态重排的。

### 剩余工作的真实口径

不要数复选框——数它会得出错误结论（本轮就清掉了 19 条过时项，包括 14 组
明明存在的 API）。按三层对齐看：

| 层 | 状态 |
|---|---|
| 全局名存在性 | 152 profile 覆盖真实 Edge **100%**，多余 **0** —— 集合层到顶 |
| 原型成员与描述符 | **969/969** 成员集合一致，缺失 0，多余 0 —— 集合层到顶 |
| 枚举顺序与 own-descriptor | 数据表管的 1178 项**逐字一致**（Node 22+）；Edge 152 原型成员顺序 27 项已校正 |
| 运行时行为 | 144 探针 / 16 类 —— **剩余工作大头仍在这里** |

「基本到顶」这个说法要限定在**集合**上。新增第四层（`window-surface-order-test.js`）
首轮就在已经报 0 差异的地方抓到 3 个真问题——集合对、顺序错，是形状层此前的盲区。

### 优先级

**这一节只做索引，复选框一律留在正文各节。** 两处都能勾会立刻漂移——本轮清掉的
19 条过时项里，「Collector 上层编排」正是这么和下方的 `[x]` 自相矛盾的。

**P0 低风险、确定性高**

1. 清理过时账目 —— 本轮完成（第四节、第八节、第十节、本节）
2. `frameElement`（§12）已完成；空白 iframe 的 `about:blank`
   **重新定性为 origin/URL 解耦改造**，单独立项（§12）

**P1 核心检测价值，需要先设计**

3. **ADR-0007 已定案并落地**（选 A + C）。实测把这条从「指纹偏差」重新定性为
   **静默错误数据**：`Object.create(parentWindow)` 不是可用的跨 Realm 委托机制，
   同源子帧里 `parent.document` 读到的是自己的文档。现已交出真实父 global，
   并用 `parent` getter 兼作 incumbent 标记补回 `event.source`（§12）
4. **ADR-0004 已定案并落地**（A：opt-in 预热池，默认 0）。
   把 254ms 拆成 148ms 异步 + 106ms 同步是决策依据：只预热 shell 会在
   `appendChild` 里同步卡 106ms，那是真实浏览器（微秒级）没有的时序特征。
   默认关闭直接化解了上次 59 项红的账目问题（§12）
5. **堆容量守卫已修**（§12）：原公式放行数超过堆能装下的数量，溢出是 SIGABRT
   而不是结构化错误。剩余的是「容量拒绝派发 error 事件」这条可检测面

**P2 最大的质量缺口**

6. ~~固定 Edge 151 的采集环境~~、~~全局的版本门控能力~~、~~换基准到 Edge 152~~
   —— **均已完成**。顺序与 descriptor 形状变成数据表，门控是一个字段；Edge 152
   fixture、Range/Policy/HTMLUserMediaElement 表面和对等性测试均已落地
7. 行为探针第一梯队**三项全部完成**：音频指纹（14 项，10 处偏差）、
   Intl / 时区（13 项）、`performance.now()` 精度（5 项，共 4 处偏差、
   2 处宿主级已登记）。剩余领域按「反爬真正读什么」判断价值不高，明确延后（§12 末）
8. **locale 已成为可切的一维**：`Intl` 默认 locale 与 UA 默认字体族都跟随 profile，
   两条内部一致性测试各自同时断言多个 locale（§12）

**P3 工程完备性，按实际采集需求**

8. WebSocket 采集（§8）、Worker 资源上限与 module cache 生命周期（§7）、
   后端异常的句柄泄漏验证（§2）、后端矩阵针对性断言与多版本性能基线（§9）

**P4 可选、延后**

9. Bundle 签名与版本兼容、受信任脚本策略（§5）；信任边界可测试与安全边界文档、
   API 文档、示例代码（§9、§10）
10. 剩余功能缺口：legacy 整文档替换、畸形 URL 的错误页文档、
    Edge 152 新增的 `NodeRange`、`OpaqueRange`、`PermissionsPolicy` 和
    `HTMLUserMediaElement` 均已实现；剩余项见本节后续清单
11. 刻意不做的两项（CSS descriptor 形状、10 个布局相关计算值）保持登记

---

## 📁 相关文档

- **架构改造计划**: [docs/架构改造计划.md](./docs/架构改造计划.md)（规划，非现状）
- **架构决策记录**: [docs/adr/](./docs/adr/)（8 篇）
- **三层对齐**: [docs/edge-parity.md](./docs/edge-parity.md)
- **Baseline 框架**: [src/infra/baseline/baseline.js](./src/infra/baseline/baseline.js)
- **测试**: `npm test`（861 项 / 82 个文件，Node 18/20/22/24 四档全绿）
- **测试数据**: [fixtures/baseline/](./fixtures/baseline/)
