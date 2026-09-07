# ADR-0008：顶层目录按职责容器归口，而不是平铺

- 状态：已接受
- 日期：2026-09
- 依赖：无（纯结构决策，不改变任何运行时行为）

## 背景

`src/` 下曾有 26 个目录平铺，颗粒度差三个数量级：

```
api/          3680 文件
install/       320 文件
plugins/        32 文件
core/           23 文件
...
network/         1 文件
utils/           1 文件
thread/          1 文件
```

分层意图（`public` → `core` → `plugins`，`api`/`install` 只做表面安装，
`collector`/`evidence`/`request-protocol` 做采集层）**是对的**，但它只存在于
阅读者脑子里。目录本身不说话：一个新人看到 `network/` 与 `api/` 并列，无法从
结构上知道前者是横向基础设施、后者是整个浏览器表面。

具体的痛点有三个：

1. **同一个域被拆三处**。`api/dom/`（实现）、`install/install-dom-*.js`（安装器）、
   `plugins/dom/`（装配策略）并列在顶层，读任何一处都要跨目录脑补另外两处。
2. **两个命名相近的 protocol**。`protocol/` 是宿主↔子进程的帧协议，
   `request-protocol/` 是请求计划与适配器。它们从来不是一回事，但并列在顶层时
   只能靠记住哪个是哪个；对外导出还叫 `nv8/protocol` 指向后者，更容易混。
3. **文档与结构对不上**。README 的目录树把 `plugin-sdk/` 画在 `src/plugins/` 下，
   而它实际在 `src/core/plugin-sdk/`——那个位置从来不存在。

## 决策

用一层**职责容器**包住散落的顶层目录。容器名就是职责名：

```
src/
├── index.js       createNv8 / nv8Eval 入口
├── public/        对外入口（EdgeSandbox、选项归一化）
├── engine/        运行时管道：core realm bootstrap webidl plugin-sdk compat
├── surface/       浏览器表面：api install
├── plugins/       装配策略：选哪些表面、依赖谁、声明什么能力
├── config/        身份与组合：profiles presets
├── backend/       进程/线程边界：controller child thread protocol
├── collection/    采集链路：collector request-protocol evidence
└── infra/         横向基础设施：baseline fingerprint navigation network
                   scheduler trace utils
```

26 → 8。三条附带效果：

- **两个 protocol 被容器分开了**，不用改名：`backend/protocol/`（帧协议）与
  `collection/request-protocol/`（请求计划）。对外导出 `nv8/protocol` 不动。
- **`plugin-sdk` 从 `core/` 提到 `engine/`**：它是横向能力，不属于 Sandbox 内核。
- **`surface/` 这个名字自己解释了 `api/` 与 `install/` 的关系**：一个是实现，
  一个是「装到哪」，它们合起来才是「浏览器表面」。

## 为什么不重构，只搬家

这次**只移动文件与改 import 路径，不动任何一行逻辑**。判据是三份 baseline：

```
bootstrap 顺序   340 步   一致
full-surface     四档     一致（逐个比对 1232 个全局的 descriptor 与原型成员摘要）
observability    trace 38 / requests 1 / navigation 2   一致
```

surface baseline 的一致性比「测试全绿」是更强的证据：它比的是运行时实际暴露的
每一个全局的 descriptor 形状，任何安装顺序或模块求值顺序的变化都会让它红。

## 执行方式：程序化，不手改 import

4158 个源文件里有 15044 处相对路径字面量。手改不可能，抽查也不可能。做法：

1. 给旧文件树拍快照（4258 个路径）；
2. 24 次 `git mv`（保留文件历史）；
3. 迁移器逐文件重算：对每个 specifier，用「该文件的旧路径」在**旧快照**里解析出
   目标文件 → 映射到新位置 → 重算相对路径。共改 **2466 个文件、5244 处**；
4. 重跑 dry-run 报 0 处待改——**幂等**，这是「改完了、没漏」的机械证据。

46 处解析不到的按原样保留，逐条核对：`fixtures/` 路径（不移动）、测试内动态生成
的 fixture 模块（`./a.js` 之类磁盘上不存在）、`new URL("./", script)` 这种运行时
URL 计算。

## 7 处语义路径必须手改

自动迁移只能处理「指向具体文件」的 specifier。指向**目录**的那些承载语义，
改错了不会报错，只会静默失效：

| 位置 | 语义 | 改法 |
|---|---|---|
| `engine/realm/module-loader.js` | `SOURCE_ROOT`，模块加载器只放行该前缀下的 `file:` URL | `"../"` → `"../../"`。留着 `"../"` 会指向 `src/engine/`，把整个 `src/surface/` 挡在外面 |
| `engine/bootstrap/sanitize-stack.js` | 仓库根，用于把 NV8 自己的帧从堆栈里滤掉 | `"../../"` → `"../../../"` |
| `backend/controller/child-process.js` | 子进程 cwd | 同上 |
| `engine/core/capability-diagnostics.js` | 读插件源码的候选路径 | `../plugins/` → `../../plugins/` |
| `engine/bootstrap/install-error-stack-guard.js` | `internalSourceRoot` | 见下 |
| `tests/evidence-contract-test.js`、`tests/protocol-artifact-test.js` | 目录形 URL | 加一层 |

### 在 install-error-stack-guard 上踩了一次

原实现是字符串截取：

```js
const internalSourceRoot = import.meta.url.slice(
  0,
  import.meta.url.indexOf("/bootstrap/") + 1,
);
```

我判断它脆弱（依赖「本文件的父目录就是 src」这个巧合，一分层就截到
`src/engine/`），改成 `new URL("../../", import.meta.url)`。结果引导阶段直接
`URL is not defined`。

**那个模块在 Realm 内求值，此刻 `hideNodeGlobals()` 已经删掉 Node 的 `URL`、
`installURL()` 还没跑。** 看似脆弱的字符串写法是**有意避开 URL 构造器**的。

现在按 `/src/` 定位：既不用 `URL`，也不依赖目录层数。

```js
const internalSourceRoot = import.meta.url.slice(
  0,
  import.meta.url.lastIndexOf("/src/") + "/src/".length,
);
```

教训不是「不该改」，是**改一处看不懂的代码之前，先问它为什么长这样**。这处的
"为什么"没有写在注释里，所以现在写上了。

## 结构守卫

容器化的价值全在「目录名就是职责名」，而它的衰减方式是渐进的：某天有人为省事在
`src/` 下新开一个目录，平铺就重新开始，一年后又是 26 个。

`tests/source-layout-test.js`（5 项）把它变成断言：

- `src/` 顶层只允许声明过的 8 项，每项必须带一句职责说明；
- 各容器只允许声明过的子目录；
- **`engine/`（`bootstrap/` 除外）不静态 import `surface/`**；
- **`surface/` 不 import `backend/` 与 `collection/`**。

新增顶层目录不是不许，是**必须显式改那份名单**——那一刻会有人问「它属于哪个
容器」。自证过：新开一个顶层目录、或在 `engine/core/` 里静态 import
`surface/install/`，立刻红。

### `bootstrap/` 是唯一例外，且必须是例外

`engine/bootstrap/` 静态 import 了几百个 `surface/install/*`。这不是分层违规，
它就是「把表面装进 Realm」这件事本身，而它自己由 moduleLoader 在 Realm 内加载。

同一条约束的另一面：`engine/core/sandbox.js` 里那四个
`new URL('../../surface/...', import.meta.url)` 常量看起来像「Core 穿透到表面层」，
实际是必要机制——那些模块操作 Realm 的 `globalThis`，必须由 Realm 自己的
moduleLoader 加载。改成静态 `import` 会把表面装到**宿主进程**。

这也解释了为什么插件的三参数 `install()` 会被判为 legacy 并跳过执行，
而真正装表面必须在 `activate(context)` 里经 `context.moduleLoader` 完成。

## 明确不做

| 项 | 为什么不做 |
|---|---|
| 给 `surface/api/`（88 域）与 `surface/install/`（320 文件）补 barrel | 这两棵树是不是生成体还没定论。barrel 与「是否生成」要一起决策，否则又多一类「声称生成却无生成器」（`finalize-window-surface-order.js` 那个反例刚还完债）|
| 按域把测试分进 `tests/{engine,surface,...}/` | `node --test` 自动发现已经解决了「新增测试要注册」，分目录只影响人找文件的路径 |
| 拆大文件（`sandbox.js` 1903 行等）| 拆分边界要按职责切，不是按行数切。没有明确职责边界之前拆，只是把一个大文件变成一堆互相 import 的小文件 |

## 后果

- `src/` 顶层 26 → 8，每一项有一句职责说明且被测试守住。
- 两个 protocol 的混淆消除，不用改名、不动对外导出。
- 890 项测试四档全绿，三份 baseline 全部一致。
- 代价：4108 个文件的 `git mv` 让 `git log --follow` 之外的历史查询多一跳；
  外部若有硬编码 `src/api/...` 路径的脚本会断——本仓库零外部依赖方，可接受。
