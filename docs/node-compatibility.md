# Node 兼容性

## 支持矩阵

| Node | 等级 | 说明 |
|------|------|------|
| 24.x | `supported` | 主要目标，开发基准；**指纹敏感场景的推荐版本** |
| 22.x | `supported` | LTS；V8 内建段顺序与 Chromium 有 2 组差异 |
| 20.x | `supported` | LTS；`ArrayBuffer.transfer` 回退为复制；**Window 全局枚举顺序无法对齐** |
| 18.18+ | `supported` | 最低版本；缺 Iterator helpers 与 `ArrayBuffer.transfer`；同上 |
| < 18.18 | 不支持 | 启动即拒绝 |

四个版本均已在完整测试套件（911 项）上验证通过。本地复现：

```
npm run test:matrix          # 自动发现 nvm 已安装版本
npm run test:matrix 18.20.8  # 指定版本
```

`engines` 声明 `>=18.18.0` 是**下限**；`.node-version` 里的 `24` 是开发基准，
不代表唯一支持版本。两者语义不同，不是矛盾。

（`.node-version` 曾经写 `24.11.0`，而 `package-lock.json` 的 `engines` 也被
写成 `24.11.0`——那是生成 lock 时 `package.json` 的旧值。三处并列会让人误以为
只支持 24。现在 lock 已重新生成，`.node-version` 改成 major-only。）

等级语义：

- `supported` — CI 阻断式覆盖，失败视为 bug
- `best-effort` — CI 允许失败，问题按兼容性改进处理

矩阵定义在 `src/engine/core/host-capabilities.js` 的 `NODE_SUPPORT_MATRIX`，
CI workflow 的 tier 标注与它一一对应。

## 能力探测：三态而非布尔

原先能力探测只返回布尔值，这在一种情况下会误导：**API 存在但不可用**。
最典型的是 `vm.SourceTextModule` —— 不带 `--experimental-vm-modules` 时
构造会抛错。若只报 `true`，调用方会以为可用，直到运行期才炸。

因此改为三态：

| 状态 | 含义 |
|------|------|
| `available` | 存在且冒烟测试通过 |
| `broken` | 存在但行为不符预期，必须给出 `reason` |
| `unavailable` | 不存在 |

```js
import { detectHostCapabilities, hostSupports } from '../src/engine/core/host-capabilities.js';

const host = detectHostCapabilities();
host.capabilities['array-buffer.transfer'];
// { id, status: 'unavailable', reason: 'not present in this runtime' }

hostSupports(host, 'array-buffer.transfer');  // broken 也算 false
```

探针做真实冒烟测试，不只查 `typeof`。例如 `array-buffer.transfer` 会
实际 transfer 一次并确认源 buffer 已分离——存在但不真正分离的实现会被
判定为 `broken`。

`features` 布尔视图保留，兼容既有调用方和 lock plan 摘要。

### 启动前置检查

```js
import { preflightHostCheck } from '../src/engine/core/host-capabilities.js';

preflightHostCheck({ warn: (msg) => logger.warn(msg) });
```

低于最低版本抛 `HOST_REQUIREMENT_UNAVAILABLE`；`best-effort` 等级只警告
并列出降级能力。

### 查看当前宿主

```
npm run capabilities
```

CI 在跑测试前先执行它，这样即便测试失败，日志里也能看到该版本缺什么。

## vm module 链接策略

各版本 API 不一致：

| API | 18 | 20 | 22 | 24 |
|-----|----|----|----|----|
| `link()`（异步） | ✓ | ✓ | ✓ | ✓ |
| `dependencySpecifiers` | ✓ | ✓ | ✓ | ✓ |
| `moduleRequests` | – | – | – | ✓ |
| `linkRequests()` | – | – | – | ✓ |
| `instantiate()` | – | – | – | ✓ |

Node 24 的 `linkRequests()` + `instantiate()` 是**同步**的，这让受信任的
内部模块可以同步导入——大量 `install-*` 聚合器依赖这一点。

Node 18–22 只有异步 `link()`，同步导入无法实现。策略层把差异显式暴露：

```js
import { detectLinkStrategy } from './realm/module-link-strategy.js';

detectLinkStrategy();
// Node 24: { strategy: 'requests-sync', supportsSyncLink: true, reason: null }
// Node 20: { strategy: 'legacy-async', supportsSyncLink: false, reason: '...use importUrlAsync()' }
```

### 两条导入路径

```js
const loader = new RealmModuleLoader(context);

loader.importUrl(url);          // 仅 Node 24+；否则抛 ERR_NV8_MODULE_SYNC_LINK_UNAVAILABLE
await loader.importUrlAsync(url); // 所有版本可用
```

同步路径在缺能力时**抛错**，而不是返回半初始化模块。错误里带
`suggestions` 指向异步路径。

异步路径的实现要点：链接与求值必须分离。`link()` 的回调要求返回**尚未
求值**的模块，若递归里提前 evaluate 了子模块，父模块链接会失败。因此
`#linkAsync()` 只链接，求值由根模块的 `evaluate()` 沿图完成。

### 测试手法

`tests/node-compat-test.js` 临时从 `SourceTextModule.prototype` 删除
`moduleRequests` / `linkRequests` / `instantiate`，模拟 Node 18–22，
验证降级路径真的可用——而不是仅存在于文档里。测试结束后恢复原型。

## 宿主 API 回退

`src/engine/compat/` 为内部实现补齐新版 API。原则：

- 优先原生实现，回退只在缺失时生效
- 保持可观察语义一致；做不到的显式抛错，不静默降级
- 只覆盖 NV8 实际用到的调用形态，不做完整 polyfill

| 函数 | 原生要求 | 回退行为 |
|------|----------|----------|
| `transferArrayBuffer()` | Node 21+ | 复制数据并如实上报 `detached: false` |
| `isArrayBufferDetached()` | Node 21+ | 用 `byteLength === 0` 近似 |
| `structuredCloneCompat()` | Node 17+ | JSON 往返；遇 Map/Set/Date/二进制/循环引用抛错 |
| `asyncDisposeSymbol()` | Node 20+ | `Symbol.for('nodejs.asyncDispose')` |
| `abortSignalTimeout()` | Node 17.3+ | `AbortController` + `setTimeout`（unref） |

`transferArrayBuffer` 的回退值得说明：ArrayBuffer 分离是 V8 层能力，
用户态无法模拟。所以回退复制数据并明确返回 `detached: false`，由调用方
决定能否接受，而不是假装分离成功。

`structuredCloneCompat` 的 JSON 回退无法表示 Map、Set、Date、RegExp、
TypedArray 和循环引用。遇到这些输入抛 `ERR_NV8_STRUCTURED_CLONE_UNAVAILABLE`，
而不是静默产出错误结果。

注意：这些回退作用于**宿主**代码。沙箱内提供给目标脚本的 API 由插件负责。

## CI 矩阵

`.github/workflows/ci.yml` 两个 job：

- `test` — Node 24 / 22 / 20 / 18.18，`best-effort` 版本设
  `continue-on-error`
- `backends` — `child-process` 与 `worker-thread` 必须行为一致

`fail-fast: false`，一个版本失败不影响其他版本继续跑。

`best-effort` 版本设 `continue-on-error` 是历史遗留：Node 18 / 20 曾各有
5 项固定失败（V8 内建缺口未接入版本门控 + `in` 触发 getter）。现在四档
**741/741 全绿**，实测方式是直接调用 nvm 里各版本的 node.exe，不切换全局符号链接：

```
D:\...\nvm\v18.20.8\node.exe --experimental-vm-modules --test ...
```

（`npm run test:matrix` 是 bash 脚本，只在 POSIX nvm 布局下可用。）

## 同步回调与预加载

有些调用点无法改成异步：ServiceWorker `controllerchange` 广播、
`postMessage` 派送、页面生命周期钩子——调用方依赖它们的同步语义。

解法是在 Realm 创建阶段（异步上下文）先把这些模块求值完，同步回调只查缓存：

```js
// realm-factory.js 创建 Realm 时
await moduleLoader.preload(SYNC_CALLBACK_MODULE_URLS);

// 同步回调内
const module = realm.moduleLoader.importUrlSyncCached(SERVICE_WORKER_RUNTIME_URL);
```

`importUrlSyncCached()` 在支持同步链接的宿主上会回退到 `importUrl()`；
不支持且未预加载时抛 `ERR_NV8_MODULE_NOT_PRELOADED`，并提示调用 `preload()`。

## 缺失宿主内建的处理

`Iterator` 全局需要 Node 22+。Node 18/20 上 `install-edge-static-functions.js`
原先会因 `Object.defineProperty(undefined, 'concat', ...)` 直接让整个
bootstrap 失败。

现在 `defineStatic` / `defineStaticGetter` 对缺失的 owner 静默跳过——
缺失的宿主能力由 `host-capabilities` 统一上报，不应让 bootstrap 崩溃。

### 补 shim 还是留空

判据是**能不能补得和原生一样**，不是「有没有办法补」：

| 缺失项 | 处理 | 理由 |
|---|---|---|
| `SuppressedError` / `DisposableStack` / `AsyncDisposableStack` | **补** | 纯语义，能做到成员集、descriptor、`length`、原生 `toString` 全一致 |
| `Float16Array` | **补形状** | 半精度存储做不到（shim 继承 `Float32Array`），但没人用它算签名 |
| `DataView.getFloat16` / `setFloat16` | **补真实实现** | 结果直接进协议字节，近似值等于静默产出错误数据 |
| `Iterator` 全局 | 留空 | 引擎级迭代器协议，用户态复刻不出 |
| `Array.prototype.toSorted` 等 | 留空 | 补 JS 版本会让 `toString` 与报错文案都对不上 |
| `RegExp.prototype.unicodeSets` | 留空 | 背后是引擎的正则编译能力，返回假值只会让特性探测得到错误结论 |
| `Set` 的集合运算 | 留空 | 同上 |
| `ArrayBuffer.prototype.transfer` | 留空（Realm 内） | V8 层能力；宿主侧另有 `transferArrayBuffer()` 回退 |

补的那部分必须做到与原生**逐字节一致**：`fixtures/baseline/full-surface.json`
的 node18 / node20 / node22 三档对这五个全局的记录与 node24 完全相同。
`tests/modern-builtins-shim-test.js` 刻意不分版本，同一张表在 24 上验原生、
在 18–22 上验 shim——分成两套期望值等于承认「shim 长什么样都行」。

留空的那部分登记在 `src/infra/baseline/known-differences.js` 的
`NODE_VERSION_DEPENDENT_MEMBERS`，由 `edge-member-parity` /
`edge-surface-parity` 在比对时剔除。不剔除的话 Node 18/20 上会永久红若干项，
而永久红的断言和没有断言等价。

`minimumNodeMajor` 取**矩阵内实测**的边界而不是按 V8 版本推算：
`ArrayBuffer.prototype.transfer` 实际随 Node 21 落地，但 21 不在矩阵里、
无法实测，所以记 22。记宽不会放过回归——这张表只在成员**确实缺失**时才被查询。

## 已知限制

- `--experimental-vm-modules` 仍是必需 flag（所有版本）。这是 Node 的
  实验性状态决定的，不是 NV8 可以绕开的。
- Node 18/20 上 `Iterator` helpers 和真正的 `ArrayBuffer` 分离不可用，
  相关 surface 与 Node 22+ 存在差异。
- **Node 18/20 上 Window 全局的枚举顺序无法与真实 Edge 一致。** V8 10.x / 11.x 在
  dictionary 模式的 global object 上把**可枚举键排在不可枚举键之前**，不按插入序
  ——违反 `[[OwnPropertyKeys]]`。V8 12.x（Node 22）已修正。

  裸 vm context 上的最小复现：先定义一个不可枚举属性、再定义一个可枚举属性，
  `Object.getOwnPropertyNames(globalThis)` 给出的相对顺序是反的，且可枚举那个排到
  了 `Object` 之前。

  | Node | 插入 `h`(不可枚举) 再插入 `e`(可枚举) | 结论 |
  |---|---|---|
  | 18.20.8 | `e` → 0，`h` → 63，`Object` → 1 | 可枚举优先 |
  | 20.20.2 | 同上 | 可枚举优先 |
  | 22.23.2 | `h` → 63，`e` → 64 | 插入序 |
  | 24.20.0 | 同上 | 插入序 |

  NV8 靠「捕获 → 全部删除 → 按目标序重定义」复现真实 Edge 的枚举顺序
  （`surface/install/finalize-window-surface-order.js`），这个前提在 18/20 上不成立：
  实测 238 个全局排到了 V8 内建之前，`window` 落在索引 0 而真实 Edge 是 678。

  **不可绕过**：`enumerable` 本身是要复现的契约值，不能为了顺序去改它。

  探针是 `vm.global-property-order`（报 `broken`），`npm run capabilities` 可见。
  `tests/window-surface-order-test.js` 在这两档上用**反向断言**豁免——宿主哪天修好了
  会红，逼人删掉豁免。
- **Node 18–22 的 V8 内建段自身的注册顺序与 Chromium 152 不同**，两组：
  TypedArray 家族的组内次序（V8 12.4 是 `Float32 Float64 Uint8Clamped BigUint64
  BigInt64`，Chromium 是 `BigUint64 BigInt64 Uint8Clamped Float32 Float64`），
  以及 `Iterator` 的位置（V8 12.4 在 `console` 之后即索引 60，Chromium 与 Node 24
  在 `Set` 之后即 44）。

  那 61 项不由 NV8 安装也不由它重排。整段重排做不到——`undefined` / `NaN` /
  `Infinity` 不可配置，删不掉。已在 `window-surface-order-test.js` 登记。
  Node 24 与 Chromium 逐位一致。
- **Node 22 之前，Realm 里的 `'X' in globalThis` 会调用 X 的 getter。**
  Node 22 才给 `vm` 的 contextified global 接上 `PropertyQueryCallback`；
  在那之前 `has` 查询是用 **getter** 实现的。实测：

  | Node | `'X' in globalThis` | getter 被调用次数 |
  |---|---|---|
  | 18.20.8 | true | **1** |
  | 20.20.2 | true | **1** |
  | 22.22.2 | true | 0 |
  | 24.11.0 | true | 0 |

  影响两处：特性探测 `'fetch' in window` 会触发 getter 的副作用（trace 会记下
  一次从未发生的属性读取）；抛错型 getter（严格能力诊断）会让 `in` 直接抛而
  不是返回 true。

  标志位是 `HAS_VM_PROPERTY_QUERY_CALLBACK`（`src/engine/compat/host-compat.js`）。
  **不要用 Proxy 包 globalThis 来抹平**——那会引入代理对象自身的可检测面，
  比这条差异危险得多。

## 测试

```
tests/node-compat-test.js   33 项
```

覆盖三态探测、版本矩阵边界、前置检查、两条链接策略、降级 API 下的
loader 行为、宿主回退。
