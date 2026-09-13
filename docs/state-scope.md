# 状态作用域

## 一个需要先纠正的判断

我此前把 `src/migration-targets/` 下的 90 个目录当成「90 个待迁移模块」，
并按 `src/surface/api/` 全目录扫出的 159 处模块级状态来估算工作量。这个口径是错的。

两点更正：

**1. `src/migration-targets/` 不是待迁移代码。** 那 90 个目录只是 Rust 源文件
到 JS 实现的映射存根，内容形如：

```js
export * from "../../api/webgl/webgl-runtime.js";
export const migrationIdentity = Object.freeze({ rustSource: "...", ... });
```

它们没有被任何代码引用，也不含状态。

**2. 经 RealmModuleLoader 加载的模块本来就是 Realm 隔离的。** 实测：

```js
const a = new RealmModuleLoader(vm.createContext({}));
const b = new RealmModuleLoader(vm.createContext({}));
(await a.importUrlAsync(url)).namespace === (await b.importUrlAsync(url)).namespace
// → false
```

每个 Realm 得到独立的 `SourceTextModule` 实例，模块级 `let` 天然不跨 Realm。

## 真正的泄漏面：宿主 ESM 图

会跨 Sandbox 共享的是**宿主 ESM 图**——从 `src/index.js` 和各插件
`index.js` 直接 `import` 进来的模块，整个进程只有一份。

插件的两条安装路径正好对应两个图：

| 路径 | 模块图 | 状态是否隔离 |
|------|--------|-------------|
| `install()`（legacy） | 宿主图，`import` 静态引入 | 否，跨 Sandbox 共享 |
| `activate()`（Core） | Realm 图，`importUrlAsync` 动态加载 | 是 |

所以同一份 `storage-state.js` 在 legacy 路径下会让两个 Sandbox 共享
localStorage，在 Core 路径下不会。

客观口径由脚本给出：

```
npm run audit:state
```

它只统计宿主图内的可变模块级状态，判定规则：

- 顶层 `let` 一律计入
- 顶层 `const x = new Map()/new Set()` 仅当文件内有 `set`/`add`/`delete`/`clear`
  调用时计入（纯查表常量不算状态）

## 迁移工具

`src/engine/core/state-scope.js`，零 import。

```js
import { createRealmSlot } from '../../core/state-scope.js';

const slot = createRealmSlot(() => ({
  localStorage: null,
  sessionStorage: null,
}), 'storage-state');

function state() {
  return slot.get(globalThis);   // 以当前 Realm 的 globalThis 为宿主
}
```

改动模式固定：`let x = null` → 放进 slot 的初始对象，调用点
`x` → `state().x`。公开 API 签名不变。

三种作用域：

| 作用域 | 语义 | 典型用途 |
|--------|------|---------|
| `realm` | 每个 Realm 一份 | Navigator、history、cookie |
| `origin` | 同 origin 共享 | localStorage 的标准语义 |
| `sandbox` | 整个 Sandbox 共享 | SharedWorker 图、SW 注册表 |

`origin` 作用域用 `createKeyedStateSlot()`：宿主是 Sandbox，二级键是 origin
字符串，带 `maxKeys` 上限防止无界增长。

Core 的 `StateRegistry` 还对显式的 sandbox/realm/app/plugin 状态提供实例级配额：
`maxContexts` 限制 Realm bucket 数，`maxKeysPerStore` 限制单个 bucket 的键数，
`maxTotalKeys` 限制所有 bucket 的键总数。覆盖写入已有 key 不消耗配额；新 Realm
插入若被拒绝不会留下空 bucket。`destroyContext()`、`destroyRealm()` 和按 Realm
`clear()` 会删除 bucket，而不是只清空 Map，使已销毁 Realm 的上下文不会长期占用容量。
`limits()` 与 `stats()` 只返回可序列化诊断快照，不暴露状态值；`stats()` 按
`sandboxKeys` / `appKeys` / `realmKeys` / `pluginContexts` 分桶报告容量占用。

槽会拒绝原始值宿主（`null`、数字、字符串），避免退化成共享单例。

## 已迁移

表格里的模块路径省略了容器前缀：`api/*` 与 `install/*` 在 `src/surface/` 下，
`navigation/*` 在 `src/infra/` 下（见 [ADR-0008](adr/0008-source-layout-containers.md)）。

| 模块 | 迁移前的模块级状态 |
|------|-------------------|
| `api/storage/storage-state.js` | `localStorage`、`sessionStorage`、两个初始数据 |
| `api/window/window-messaging.js` | `windowHandlers`、`localOrigin`、`parentFacade`、`topFacade` |
| `api/dom/cookie-state.js` | `cookies`、`cookieStoreInstance` |
| `api/dom/html-element-constructor.js` | `specializedFactories`、`unknownElementFactory` |
| `api/device/device-runtime.js` | `geolocationSingleton`、`nextWatchId`、`watches`、`sensorProfile` |
| `api/indexed-db/indexed-db-runtime.js` | `databases`、`factorySingleton` |
| `api/fetch/fetch-replay.js` | `records`、recorder、SW 拦截器、`sequenceCursor` 等 6 项 |
| `api/navigator/navigator-state.js` | `profile`、`capabilities`、`singleton`、`services`、`vibrationPattern` |
| `api/scheduling/scheduling-runtime.js` | 三个单例、`nextIdleId`、`idleTimers` |
| `navigation/navigation-state.js` | `entries`、`currentIndex`、导航钩子等 6 项 |
| `api/dom/html-iframe-element-realm-state.js` | `createChildRealm`、`parentPageUrl`、frame 索引集合 |
| `api/worker/service-worker-runtime.js` | ServiceWorker factory、页面 URL、容器单例、启用状态、初始 controller |
| `api/file-system/file-system-runtime.js` | 虚拟根目录、bucket、observer、StorageManager、BucketManager |
| `api/media-agency/media-agency-runtime.js` | session 序号、MediaDevices/Capabilities/Session 单例 |
| `api/user-agency/user-agency-runtime.js` | 权限状态、剪贴板内容、Permissions/Clipboard 单例 |
| `api/coordination/coordination-runtime.js` | 命名锁队列、LockManager/WakeLock 单例 |
| `api/credential-payment/credential-payment-runtime.js` | 凭据 Map、CredentialsContainer 单例、支付序号 |
| `api/local-fonts/font-face-set-runtime.js` | prototype 安装标记、Edge 151 开关、Worker fonts 单例 |
| `api/xr/xr-core-runtime.js` | 动画帧序号、anchor/plane 集合工厂 |
| `api/messaging/messaging-runtime.js` | BroadcastChannel 分组、存活集合、跨 Realm connector |
| `api/gpu/gpu-runtime.js` | WebGPU profile、GPU 单例 |
| `api/media/html-media-element-codec-profile.js` | 音频/视频编解码器白名单 |
| `scheduler/monotonic-clock.js` | `profile`、`sessionTimeOrigin`、`lastTimestamp`、`lastWallClock`、`jitterState` |

宿主图待迁移状态数：**85 → 0**。

## 时钟的作用域决策

`monotonic-clock.js` 不能照抄前面的模式，因为它的状态分两类，语义不同。

**指纹配置**（`wallClockOffsetMs`、`dateNowResolutionMs`、`jitterSeed`……）
语义上属于 Sandbox：同一个浏览会话里父窗口与 iframe 的 `Date.now()` 偏移量
必须一致，否则很容易被检测。

但用「共享模块变量」来实现这个一致性是错的手段——它会让任意 Realm 的
`configureTimingProfile()` 逆向覆盖其他 Realm。一致性应该由调用方保证：
`src/engine/core/sandbox.js` 的所有 Realm 创建点都从同一份 `profile.timing` 取配置。

**运行时游标**（`timeOrigin`、`lastTimestamp`、`lastWallClock`、`jitterState`）
必须 per-Realm：

- `performance.timeOrigin` 按规范就是每个 Document/Worker 独立的
- `performance.now()` 的单调游标基于各自的 timeOrigin，共享会互相抬高
- jitter PRNG 按 Realm 隔离后序列可复现；共享时多 Realm 交错消耗，
  同一段目标脚本两次运行会拿到不同抖动量

所以两类都按 Realm 存储。注意 `timeOrigin` 来自配置而非「Realm 创建时刻」，
因此迁移后同一 Sandbox 内各 Realm 的 timeOrigin 仍然相同——行为不变，变的
只是不再互相覆盖。

`tests/state-scope-test.js` 有三条针对性断言：跨 Realm 配置互不覆盖、
固定 seed 的 jitter 序列可复现、单 Realm 内 `performance.now()` 保持单调。

## 棘轮

`tests/state-scope-test.js` 里有一条预算断言：宿主图待迁移状态数必须为 0。
新增模块级状态会让它失败，只能通过继续迁移来下调阈值。

另有一条断言检查已迁移文件不再出现那些具体变量名，防止回退。

状态容量策略由 `createNv8({ limits })` 传入：`maxStateContexts`（默认 256）、
`maxStateKeysPerStore`（默认 4096）和 `maxStateTotalKeys`（默认 65536）。这些
上限属于 Sandbox 实例，既不会跨实例共享，也不会把状态值写入诊断或日志。

## 收尾：4 处保留为进程级

迁移到最后剩下 4 处，逐个审阅后判定它们**本来就该是进程级**，强行按 Realm
隔离反而错误：

| 位置 | 判定理由 |
|------|---------|
| `clone/structured-clone-algorithm.js` `transferHandlers` | 扩展点注册表。由 install-* 在启动时注册类型处理器，属于能力声明而非运行时数据 |
| `crypto/hash.js` `sha512Constants` | SHA-512 轮常量的惰性缓存。纯不可变数学常量，跨 Realm 共享无可观察差异 |
| `webidl/native-function-realm-safe.js` `realmContexts` | 按 Realm ID 索引的上下文注册表。它本身就是跨 Realm 管理器，隔离它会让其失去意义 |
| `webidl/native-function.js` `currentContext` | 安装期的当前上下文指针。由 `setNativeFunctionContext()` 在 Realm 激活时设置，安装完成后失效 |

这 4 处登记在 `scripts/audit-module-state.mjs` 的
`REVIEWED_PROCESS_LEVEL_STATE` 里，**每项必须写明理由**。审计输出会单独
列出它们，不计入待迁移数。

另有一条测试断言每条豁免都带有实质理由，防止后来者把不该豁免的东西
默默塞进白名单。

## 审计输出

```
npm run audit:state
```

```
宿主 ESM 图模块数      : 1813
待迁移的文件          : 0
待迁移的模块级状态    : 0
已审阅的进程级状态    : 4
```

## 迁移过程中踩到的坑

**标识符误伤。** 批量替换 `profile`、`view`、`singleton` 这类常见名时，
会连带改到函数参数、对象字段和函数名。需要用词边界正则
`(?<![\w.$])name(?![\w:$])`，并在替换后修回 slot 定义内部的字段名。

**命名冲突。** 有几个文件已存在同名 `WeakMap`（如 `collectionState`、
`uaDataState`），生成的访问器函数会与之重名。需要给访问器换名。

**多行 import 的贪婪匹配。** 用正则找「最后一个 import」时，多行
`import { ... } from` 会把后续函数体一起吞掉，导致 slot 块插进函数体内部。
`svg-element-constructor.js` 就中了这个，需要手工挪回去。
