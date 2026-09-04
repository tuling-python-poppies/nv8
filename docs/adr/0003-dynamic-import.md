# ADR-0003：动态 `import()` 走离线重放，未命中给结构化拒绝

- 状态：已接受
- 日期：2026-01
- 依赖：ADR-0001（按需组装）

## 背景

当前动态 `import()` 在所有路径上一律拒绝：

| 路径 | 行为 |
|------|------|
| 页面脚本 | `TypeError: Dynamic import is unavailable in page scripts` |
| Worklet | `TypeError: Dynamic Worklet imports are unavailable.` |
| 用户 eval / Worker | `rejectUserImport()` 抛两类 TypeError |
| 内部受信模块 | `TypeError: Dynamic import is disabled for internal modules` |

而**静态** import 已经支持从 replay 解析（`page-script-runner.js` 的
`linkModule` + `resolveReplay`）。两者不一致：同一份 Evidence Bundle 里的
模块，静态引入能跑，动态引入不能。

## 需要决策的问题

动态 `import()` 是继续一律拒绝，还是走离线重放？

## 考虑过的三个方案

### 方案 A：继续一律拒绝

最安全，零新增攻击面。但代价是一类目标站点直接无法运行——代码分割和懒加载
是主流打包产物形态，`import()` 出现频率很高。

且它与已支持的静态 import 不一致，用户会困惑「为什么 `import x from` 行但
`await import()` 不行」。

### 方案 B：完全支持，未命中时走真实网络

违背整体离线原则。NV8 的 Fetch/XHR 都只能命中 replay fixture，模块加载没有
理由例外。真实网络出口只属于 Collector（ADR-0001 及安全边界）。

否决。

### 方案 C：离线重放 + 结构化拒绝（采纳）

动态 `import()` 从 Evidence Bundle / replay 解析，与静态 import 共用同一套
解析逻辑。未命中时抛**结构化**错误，而不是笼统的 "Network module loading is
unavailable"。

## 决策

采纳方案 C。

### 允许的 specifier 形式

| 形式 | 处理 |
|------|------|
| 相对路径（`./x.js`、`../y.js`） | 相对当前模块 URL 解析后查 replay |
| 绝对 URL（`https:`、`http:`） | 直接查 replay |
| `data:` URL | 内联解码，无需 replay（自包含，不涉网络） |
| 裸 specifier（`lodash`） | 拒绝：浏览器无 import map 时同样失败 |
| `node:` / `file:` / 绝对文件路径 | 拒绝：宿主模块不对目标脚本开放 |

裸 specifier 的拒绝理由要说清：这不是 NV8 的限制，浏览器在没有 import map
的情况下同样会抛 `Failed to resolve module specifier`。保持一致比擅自支持更好。

### 未命中必须给可行动诊断

当前的 `Network module loading is unavailable in this offline sandbox` 无法
回答「我该把什么加进 Bundle」。新错误必须包含：

| 字段 | 内容 |
|------|------|
| `specifier` | 原始 specifier |
| `resolvedUrl` | 解析后的绝对 URL |
| `referrer` | 发起 import 的模块 URL |
| `code` | `ERR_NV8_MODULE_REPLAY_MISS` |
| 可用模块列表 | 便于发现 URL 拼写差异 |

这与已有的 `ERR_NV8_REPLAY_MISS`（fetch/XHR）和
`ERR_NV8_WORKER_REPLAY_MISS` 保持同一族。

### 模块缓存作用域

**per-Realm**。同一 specifier 在同一 Realm 内只求值一次，跨 Realm 不共享。

理由与 ADR-0001 的状态作用域一致：模块实例持有状态，跨 Realm 共享会破坏隔离。

缓存键是**解析后的绝对 URL**，不是原始 specifier——`./a.js` 和 `../dir/a.js`
可能指向同一模块。

### 循环依赖

由 `vm.SourceTextModule` 的 link 机制处理，与静态 import 相同。缓存在
`link()` **之前**写入，因此循环引用能拿到未完成的模块占位而不是无限递归。

### 内部受信模块仍然拒绝

`RealmModuleLoader` 加载的是 NV8 自身代码，其 `importModuleDynamically`
保持拒绝。目标脚本无法触达这条路径，放开它只会增加攻击面。

## 不做的事

- 不支持 import map（超出当前需求，且需要 HTML 解析配合）
- 不支持 `import.meta.resolve()`
- 未命中不回退到真实网络，任何情况下都不

## 影响的现有产物

- `src/engine/core/page-script-runner.js`：`importModuleDynamically` 改为走 replay
- `src/engine/realm/dynamic-import.js`：错误改为结构化，新增解析逻辑
- `src/backend/child/runtime-pool.js`：三处 `rejectUserImport` 改为共用解析
- Worklet 路径：保持拒绝（Worklet 规范本身不支持动态 import）

## 验收标准

1. 相对路径 / 绝对 URL / `data:` 的动态 import 能命中 replay 并求值
2. 未命中抛 `ERR_NV8_MODULE_REPLAY_MISS`，含 specifier / resolvedUrl / referrer
3. 裸 specifier 与 `node:` 前缀的拒绝消息与浏览器一致
4. 同一 URL 在同一 Realm 内只求值一次
5. 循环依赖不死锁
6. 任何情况下不发起真实网络请求
7. 内部受信模块路径仍拒绝动态 import


---

## 实施记录

实现时撞到四个问题，都改变了细节。

### 一、原实现把 `/` 当文件路径拦掉

旧 `BLOCKED_PREFIXES` 含 `'/'`，本意防 `/etc/passwd`。但 `/` 在浏览器里是
**根相对 URL**，`import('/mod/a.js')` 是最常见写法之一，被直接拦死。

改为只拦 `node:`，非网络协议靠**最终解析结果的协议白名单**拦。这更可靠：
`/etc/passwd` 配 http referrer 解析成 `https://origin/etc/passwd`，是普通
URL，走 replay 未命中即可，不构成文件读取风险；`file:///etc/passwd` 协议
不在白名单，被拒。

### 二、`referrer` 参数是对象不是字符串

Node 的 `importModuleDynamically(specifier, referrer)` 第二参是
`vm.SourceTextModule` / `vm.Script` **实例**。直接当字符串用会让
`new URL(specifier, referrer)` 拿到 `"[object Object]"` 而解析失败。

加了 `normalizeReferrer()` 从 `identifier` / `filename` / `url` 提取，
调用处同时显式绑定已知的模块 URL。

### 三、合法 specifier 形式判断不全

`isRelative` 只认 `./` 和 `../`，漏了根相对路径。浏览器承认三类：相对路径、
根相对（含协议相对 `//host/path`）、完整 URL——只有裸 specifier 需要
import map。

### 四、边递归边 link 会在循环依赖上失败

第一版 `loadModule()` 递归创建并链接，循环依赖时报：

```
request for './right.js' can not be resolved on module
'https://target.test/app/left.js' that is not linked
```

原因是仍处于 `linking` 状态的模块被交给了 linker 回调。

改为**创建与链接分离**：`instantiate()` 只建实例入缓存，只在根模块上调一次
`link()`，让 Node 自己遍历整图，linker 回调里只查表或新建实例。Node 内部的
链接机制本身能处理循环。

同一个坑在 `src/engine/realm/module-loader.js` 的异步路径上也踩过——两处现在用了
同样的三阶段结构。

## 验收结果

| 标准 | 状态 |
|------|------|
| 相对 / 根相对 / 绝对 URL / `data:` 能命中 replay 并求值 | ✅ |
| 未命中抛 `ERR_NV8_MODULE_REPLAY_MISS`，含 specifier / resolvedUrl / referrer | ✅ |
| 裸 specifier 与 `node:` 的拒绝消息与浏览器一致 | ✅ |
| 同一 URL 在同一 Realm 内只求值一次 | ✅ |
| 循环依赖不死锁 | ✅ |
| 任何情况下不发起真实网络请求 | ✅ |
| 内部受信模块路径仍拒绝动态 import | ✅ |

测试：`tests/dynamic-import-test.js`（25 项）。含两条边界断言——
`resolveSource` 是唯一取源入口，以及源码不 import 任何网络/文件系统模块。

## 各执行路径的最终策略

| 路径 | 动态 import | 理由 |
|------|-------------|------|
| 页面脚本 | ✅ 重放 | 主要目标场景 |
| `evaluateModule()` | ✅ 重放 | 与页面脚本同一条路径 |
| Worker（module + classic） | ✅ 重放 | Worker 里代码分割同样常见 |
| Worklet | ❌ 拒绝 | 规范本身不支持动态 import |
| eval 脚本 | ❌ 拒绝 | 见下 |
| 内部受信模块 | ❌ 拒绝 | NV8 自身代码，放开只增加攻击面 |

### 为什么 eval 保持拒绝

`vm.Script` 编译结果被 `SCRIPT_CACHE` **跨 Realm 复用**，因此
`importModuleDynamically` 闭包无法绑定 per-Realm 的模块缓存——绑了就会让
A Realm 的模块泄漏到 B Realm，违反 ADR-0001 的状态作用域。

需要模块的场景应走 `evaluateModule()`，它有明确的 Realm 归属。拒绝消息里
写明了这一点（`"cached eval scripts"`）。

### 共享入口

调用方不再各自实现 `link()`——`createDynamicImporter()` 返回的函数带
`loadEntryModule(source, url)`，内部用「创建与链接分离」的三阶段结构。

这是刻意的：自己写 `link()` 很容易踩「边递归边 link」的坑，循环依赖时失败。
这个坑我在本 ADR 实施中踩过一次，在 `module-loader.js` 的异步路径上踩过一次。
把它收进共享入口，第三处不会再踩。
