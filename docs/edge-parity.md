# 与真实 Edge 的对等性检查

> 分层理由、登记表机制与已知方法论陷阱见 `docs/adr/0006-parity-layers.md`；
> 机器相关值的处理规则见 `docs/adr/0005-machine-specific-values.md`。

Baseline（`docs/baseline.md`）保证的是「NV8 自己前后一致」。它抓不到一类问题：
NV8 从一开始就和真实浏览器不一样。这份检查补上后者。

两者互补，不能互相替代：

| | 参照物 | 抓什么 |
|---|---|---|
| Baseline | NV8 上一次的录制 | 重构引入的回归 |
| Edge 对等性 | 真实 Edge 151 采集结果 | 与真实浏览器的固有偏差 |

## 层级划分

对等性检查按精细度分层。层级越深，能发现的问题越具体。

[ADR-0006](adr/0006-parity-layers.md) 定的是前三层的**职责划分**（存在性 / 成员 /
行为，互不可代替）。第四节不是新的职责层，是**形状层里一个此前没测过的维度**：
前两层比的都是集合，不是顺序。

### 一、全局名存在性

`tests/edge-surface-parity-test.js` — 比 `Object.getOwnPropertyNames(globalThis)`。

最表层。1236 个真实全局中 NV8 覆盖 99.68%。

### 二、原型成员明细

`tests/edge-member-parity-test.js` — 比每个构造函数 `prototype` 上的成员名。

966 个原型中 **963 个成员集完全一致**，缺失 0、多余 0；剩下 3 个是 NV8 完全没有的
原型（只剩 `HTMLUserMediaElement` 未实现，另两个已补齐）。`fetch` 存在不代表
`Response.prototype` 齐全，这一层才看得到。

### 三、行为

`tests/edge-behavior-parity-test.js` — 跑同一段代码，比结果。

**144 个探针分 16 类**：报错文案、`toString` 形态、类型标签、非法接收者、
构造器守卫、arity 元数据、Error 形态、集合语义、CSSOM、Canvas 形状、
音频指纹、Intl / 时区、`performance.now` 精度、事件时序、跨 Realm 身份、URL 解析。

扩探针的历史，每一轮都在「形状层报 0 差异」的地方挖到东西：

| 轮次 | 新增探针 | 发现 |
|---|---|---|
| 首轮 | 33 | 15 处不一致，已修完 |
| CSSOM | 22 | 6 处，已修完 |
| 跨 Realm | 14 | **全部同一根因**——动态 iframe 的 `contentWindow` 同步为 null（ADR-0004 落地后可用 `limits.prewarmChildRealms` 关掉）|
| 音频指纹 | 14 | **10 处**，含五处报错类型错、float32 极值被当 double 写死 |
| Intl / 时区 + performance | 18 | 4 处，其中 2 处是宿主级（ICU 数据版本、V8 文案），已登记 |

现状：**140 项一致，4 项登记**——2 项动态 iframe 时序，2 项宿主级差异。

探针定义在 `src/infra/baseline/behavior-probes.js`，采集脚本与测试**共用同一份**——
各写一份必然漂移，漂移后比较就没有意义。

准入条件三条：**跨运行确定**、**与机器无关**、**可序列化**。因此只取引擎固定
产出的结构性事实，不取 CPU 核数、屏幕尺寸、时区这类机器指纹。采集时跑两轮并
要求逐字一致，探针本身在抖就直接失败。

刻意不测的：`measureText` 字形宽度取决于已安装字体、`width`/`height` 取决于
视口与排版——它们是机器指纹或需要布局引擎，不属于行为契约。

仍未覆盖：字体度量。

### 四、枚举顺序与 own-descriptor 形状

`tests/window-surface-order-test.js`（27 项）— 比
`Object.getOwnPropertyNames(window)` 的**序列**，以及 window 自身 1175 个
own property 的 descriptor flag。

前三层谁都没比过这两个：第一层比的是名字集合（且 fixture 里成员已排序），
第二层比的是**原型**成员的 descriptor，不是 window 自身的。

首轮抄到三个真问题：

| 发现 | 形状层能看到吗 |
|---|---|
| `FontFaceSet` 在 151 profile 下落在索引 61（真实 517）| 不能，名字存在性是绿的 |
| `window.chrome` 被写成 `configurable: false` | 不能，window 自身的 descriptor 从未比过 |
| Node 18/20 上 238 个全局排到 V8 内建之前 | 不能，名字 / descriptor / 成员全都对 |

#### Window own-descriptor 形状

1175 项的 flag 只有五种组合，已逐条与真实 Edge 152 实测对齐（零不一致）：

| 形状 | flag | 数量 | 对应 |
|---|---|---|---|
| `VALUE_HIDDEN` | value, writable, 不可枚举, 可配置 | 932 | WebIDL interface object（规范要求非枚举）|
| `VALUE_ENUMERABLE` | value, writable, 可枚举, 可配置 | 50 | 49 个 Window operation 加 `chrome` |
| `ACCESSOR` | get/set, 可枚举, 可配置 | 184 | Window attribute |
| `ACCESSOR_LOCKED` | get/set, 可枚举, 不可配置 | 4 | `window` / `document` / `location` / `top` |
| `ACCESSOR_HIDDEN` | get/set, 不可枚举, 可配置 | 1 | `offscreenBuffering` |

get/set 取捕获值而不在表里写死：真实 Edge 有 26 项只有 getter
（`document` / `navigator` / `crypto` / `localStorage` …），实测 NV8 零差异。

#### 为什么必须同时断言多个 profile 版本

`FontFaceSet` 那个 bug **只在 profile 版本 ≠ 数据表默认版本时可见**。只测默认
150 profile 永远是绿的，因为 150 下这一项本来就不应存在。这与 `Intl` 默认 locale、
UA 默认字体族那两个 bug 是同一类陷阱：在与 profile 同维度的默认值上测试，
看不见跟随失败。

#### 宿主级限制

- **Node 18/20：顺序做不到**。V8 10.x / 11.x 在 dictionary 模式的 global object 上
  把可枚举键排在不可枚举键之前，不按插入序。而 `enumerable` 本身是要复现的契约
  值，不能为了顺序去改。探针：`vm.global-property-order`（报 `broken`）。
- **Node 18–22：V8 内建段自身的注册顺序与 Chromium 不同**——TypedArray 家族的
  组内次序、`Iterator` 的位置。那 61 项不由 NV8 安装也不由它重排（`undefined` /
  `NaN` / `Infinity` 不可配置，整段重排做不到），已登记。Node 24 逐位一致。

两条的豁免都用**反向断言**而不是 `return` 跳过：宿主哪天修好了，反向断言会红，
逼人删掉豁免。沉默跳过的分支和不存在的断言等价。

#### 原型成员的枚举顺序：新发现的缺口

同一条道理向下一层：原型成员的顺序也是一维，而 `edge-members.json` 里成员是
排过序的，谁都没比过。实测（NV8 151 profile vs 真实 Edge 152）：963 个共有
原型里 **941 个顺序一致、22 个不一致**（3 个仅 `constructor` 位置错）。典型例：

```
LargestContentfulPaint
  真实：… toJSON, constructor, paintTime, presentationTime
  NV8 ：… toJSON, paintTime, presentationTime, constructor
```

根因是「先装完所有成员再装 constructor backlink」的惯例，而 Chromium 里
`paintTime` / `presentationTime` 是后置注册的。本轮新实现的两个 151 接口已按真实
顺序接线并有断言守住；那 22 处登记为独立项，本轮不一并括进测试——永久红的断言
和没有断言等价。

## 差异的严重程度不对称

这是两份测试共同的设计前提：

- **多出**（NV8 有、Edge 没有）：**可检测特征**，目标是 0。多一个真实浏览器
  没有的东西，等于给沙箱盖章。
- **缺少**（Edge 有、NV8 没有）：功能缺口。目标脚本用到才暴露，必须**登记理由**。

所以两份测试对「多出」是硬断言（`assert.deepEqual(offenders, [])`），
对「缺少」只要求登记 + 数量上限只允许下调。

## 行为层首轮的三类发现

**legacy 模式完全没有原生函数伪装。** `setNativeFunctionContext` 只有 webidl
插件会调用，legacy（默认模式）从未建过上下文，于是所有
`registerNativeFunction` 永久滞留在队列里、`Function.prototype.toString`
从未被接管：

```
Function.prototype.toString.call(document.addEventListener)
  真实:   "function addEventListener() { [native code] }"
  修复前: "call(...args) { return invoke(this, args); }"
```

这是最经典的检测手法。一个根因造成 5 项偏差。

**WebIDL 实参个数完全不检查。** `document.addEventListener()` 静默返回
undefined。真实文案是固定模板，单复数都算特征：

```
Failed to execute 'addEventListener' on 'EventTarget': 2 arguments required, but only 0 present.
Failed to execute 'getElementById' on 'Document': 1 argument required, but only 0 present.
```

**构造器文案与行为。** `Please use the 'new' operator` 缺后半句
`, this DOM object constructor cannot be called as a function.`（38 处）；
`Illegal constructor` 缺 `Failed to construct 'X': ` 前缀（244 处）；
`new Document()` 在真实浏览器里**允许**并构造一个空 XML 文档，NV8 却抛错。

## 已发现并修复的偏差

### `Event.prototype.isTrusted` 位置错误

```
Object.getOwnPropertyNames(Event.prototype).includes('isTrusted')
  真实 Edge: false      NV8 修复前: true

Object.getOwnPropertyNames(new Event('x')).includes('isTrusted')
  真实 Edge: true   descriptor: { get: function, configurable: false }
```

`isTrusted` 在 WebIDL 里标注 `[LegacyUnforgeable]`——定义在**每个实例**上而非
原型上，`configurable: false` 使脚本无法删除或改写。放在原型上是明确可检测的：
反检测脚本会专门检查 unforgeable 属性的位置。

修复：`initializeEvent()` 对每个新建 Event 调用
`installEventIsTrustedOnInstance()`。

### `NetworkInformation.prototype.type` 多余

真实桌面 Edge 的 `NetworkInformation.prototype` 只有
`constructor, downlink, effectiveType, onchange, rtt, saveData`。
`type` 是旧 API 属性，Chromium 只在 Android 暴露。

实现保留在 `installNetworkInformationTypeForMobile()`，等将来的移动端 profile。

### 两个宿主特征泄漏

- `AsyncIterator` — Node 24 的 V8 特性，Edge 151 没有。由
  `hide-node-globals.js` 删除。
- `webkitAudioContext` — Edge 151 已移除的旧别名。不再安装。

## 采集

采集分三个脚本，因为三份数据的规模和人工核对需求差别很大：

```
npm run fingerprint:collect   # 指纹字段（UA/brands/WebGL），小，需人工核对
npm run fingerprint:globals   # 全局名列表，1236 项
npm run fingerprint:members   # 原型成员明细，8941 项
npm run fingerprint:behavior  # 行为探针，33 项（跑两轮校验确定性）
```

都走 headless Edge + `--dump-dom`，**不依赖 Puppeteer/CDP**——浏览器自动化不是
NV8 的职责，这些是一次性数据工具。

产物在 `fixtures/fingerprint/`，随 Edge 版本更新时重新采集。

## 已知的方法论陷阱

**采集基准的版本必须和 profile 对齐。** 最初拿 Edge **151** 的全局列表去比 NV8
默认的 **150** profile，`FontFaceSet` 被误判为缺口——它在 151 profile 下是存在
的（`browserMajorVersion >= 151` 才暴露）。版本差异不是缺陷。

**机器相关字段不能照抄。** WebGL 的 `unmaskedRenderer`、`hardwareConcurrency`、
`deviceMemory`、`languages`、屏幕参数都绑定采集机器。照抄会把指纹钉死在一台
机器上，比用中性默认值更可疑。

WebGL 尤其容易踩这个坑，因为它有**两组** vendor/renderer：

| 参数 | 取值 | 机器相关 |
|---|---|---|
| `gl.VENDOR` / `gl.RENDERER` | `"WebKit"` / `"WebKit WebGL"` | 否，Chromium 固定值 |
| `UNMASKED_VENDOR_WEBGL` (0x9245) | `"Google Inc. (NVIDIA)"` | 是 |
| `UNMASKED_RENDERER_WEBGL` (0x9246) | `"ANGLE (NVIDIA, ...)"` | 是 |

masked 参数在任何机器上都相同，GPU 信息只通过 `WEBGL_debug_renderer_info`
扩展暴露。NV8 曾把 GPU 字符串放在 masked `RENDERER` 上，且 `VENDOR` 返回
`"Google Inc."` 而非 `"WebKit"`——两处都已修正，由
`tests/webgl-parity-test.js` 锁定。

**全局枚举顺序。** 曾担心采集脚本 `sort()` 会丢掉顺序指纹。实测真实 Edge 的
`Object.getOwnPropertyNames(globalThis)` 本身就是字母序（WebIDL 接口按字母序
注册），没有信息损失。采集脚本仍保留原始顺序，以便顺序变化能被发现。

## GPU 身份的内部一致性

单一硬编码 GPU 让所有 NV8 实例声称使用同一块显卡——指纹在群体里唯一，就
失去了混入人群的意义。`src/infra/fingerprint/gpu-profiles.js` 提供 5 套真实桌面
GPU 组合（选取 Steam 硬件调查份额较高的型号，冷门型号反而突出）。

更隐蔽的问题是一块 GPU 的身份散落在多个字段：

```
webglVendor        "Google Inc. (NVIDIA)"
webglRenderer      "ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 Direct3D11)"
webgpu.vendor      "nvidia"
webgpu.device      "NVIDIA GeForce RTX 5060"
webgpu.description "NVIDIA driver 32.0.15.8097"
webgpu.subgroupMinSize / MaxSize   32 / 32
```

手改型号漏掉任何一处就出现「WebGL 说 NVIDIA、WebGPU 说 Intel」这类矛盾。
因此字段由 `deriveGpuIdentity()` 从「厂商 + 型号 + 驱动」推导，而不是手写
N 遍同一规则；`validateGpuIdentity()` 校验自洽性，`tests/gpu-profiles-test.js`
用故意构造的矛盾验证校验器真的有效。

`subgroupMinSize`/`subgroupMaxSize` 不是任意值：NVIDIA warp 是 32，
AMD wave64 是 32–64，Intel EU SIMD 是 8–32。填错就是硬件层面的矛盾。

## 修复对等性偏差后要重录 Baseline

改动全局或原型形状会让 Baseline 失败——这正是它该有的行为。确认变更是有意的
之后：

```
node scripts/capture-full-surface.mjs --write   # 每个 Node 大版本各跑一次
```

`fixtures/baseline/surface.json`（精选 24 全局）如有摘要变化需同步更新。
