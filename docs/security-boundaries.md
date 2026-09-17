# NV8 信任边界与安全模型

本文定义 NV8 的安全边界。这里的“沙箱”首先是**执行隔离和能力分层**，不是对任意恶意 JavaScript 的形式化安全承诺；生产环境仍应使用进程隔离、资源限制和最小权限运行宿主。

## 边界总览

```text
目标页面脚本 ──(vm.Context、离线 replay、scriptPolicy)──> Realm
                                  │
                                  │ 仅由 Core 编排
                                  ▼
Evidence ──> Core/Realm ──> Runtime Artifact ──> Protocol ──> Collector ──> 网络

Plugin 是宿主侧受信扩展，不在目标页面脚本的权限域内。
```

| 组件 | 信任级别 | 可以做什么 | 明确不能假设什么 |
|---|---|---|---|
| 目标页面脚本 | 不可信输入 | 使用 Realm 中已安装的 Web API，读取离线回放，产生结果 | 不能访问 Collector、Protocol、宿主 `process`/`require` 或真实网络；不能把脚本来源可信化 |
| Plugin | 受信宿主代码 | 安装/激活 surface，使用声明的状态作用域和注册表 | 不是不可信代码沙箱；插件实现本身可执行 Node 代码，发布前必须审计 |
| Core / Realm | 编排层 | 创建、销毁和 reset Realm，安装 surface，执行脚本，施加资源限制 | 不把 `vm.Context` 当作抗宿主逃逸的安全边界；不应向 Realm 注入宿主对象 |
| Evidence | 外部输入 | 提供 HTML、脚本和网络 replay；Loader 可验证签名、schema 和策略 | Bundle 的签名不等于其中每个目标脚本自动获权；Core 不应绕过 EvidenceSource 契约读文件 |
| Protocol | 受限纯变换 | 读取 request、artifact 和时间，生成声明式 RequestPlan/transform | 不能发起 IO、访问 Collector、读取文件或取得宿主凭据 |
| Collector | 唯一网络出口 | 校验 RequestPlan、应用 origin/network policy、管理 cookie/credential、发送请求 | 不因代理错误绕过 allowlist；业务消息发送后不得默认重试以避免重复提交 |

## 目标脚本边界

页面脚本在每个 Realm 独立的 `vm.Context` 中执行。页面脚本中的 `fetch`、XHR、WebSocket 和 Worker 只连接到 NV8 的离线回放或受控后端，不是 Collector 的别名。

`runtime.scriptPolicy` 是脚本执行授权，而不是 JavaScript 语言隔离：

- `allowInline`、`allowExternal`、`allowModules` 和 `allowDataUrls` 独立控制脚本类别；
- `allowedOrigins` 对解析后的 URL 做 origin allowlist；
- 静态 module 依赖与动态 `import()` 经过同一授权回调；
- 拒绝使用 `ERR_NV8_SCRIPT_POLICY_REJECTED`，并沿现有脚本 `error` 事件路径报告；
- 策略拒绝不会回退到真实网络；
- Core 的内部 surface/module loader 不接受页面的 URL allowlist，避免目标脚本策略误伤内部受信模块。

页面脚本不应获得 `fs`、`net`、`tls`、`child_process`、Collector、Protocol registry、私钥或未脱敏 credential。不要把带有宿主闭包、原生句柄或可回溯到宿主对象的对象挂到 `globalThis`。

> `vm.Context` 的隔离依赖 Node/V8 宿主实现。若威胁模型包含主动寻找 V8/Node 逃逸的攻击者，应在独立 OS 用户、容器或子进程中运行 NV8，并配合 CPU、堆和墙钟限制。

## Plugin 边界

Plugin 的 `install`/`activate`/生命周期钩子在宿主侧运行，是供应链信任边界，不是页面脚本边界。插件可以改变其声明允许的 surface，并可通过 SDK 访问：

- 自己的 sandbox/Realm 状态作用域；
- 声明的 surface registry 与必要的全局注册表；
- 受控 logger/trace 和生命周期钩子。

插件注册、依赖解析和 lock plan 用于确定性装配，不会把插件变成不可信代码。生产发布应固定插件版本和 lock plan，审计插件依赖，避免把 Collector、credential store 或私钥放入普通插件上下文。

## Evidence 边界

Core 只接受 `EvidenceSource` duck-typed 契约（`has`、`readText`、`readBinary`、脚本/页面/replay 列举与 `describe`），不直接依赖磁盘格式。Evidence Loader 负责容器、canonical JSON、Ed25519 签名和 schema 兼容性；调用方必须按 `keyId` 提供信任公钥，Bundle 不携带自己的信任根。

脚本权限与 Bundle 信任分离：

- `entrypoints-only`：只执行 source 声明的入口脚本；
- `allowlist`：只执行声明且被调用方列出的脚本；
- `deny-all`：不执行 Evidence 脚本。

签名私钥不进入 Bundle、源码、日志或诊断。Evidence 中的 URL 只产生离线 replay 读取，不自动获得 Collector 的网络权限。

## Protocol 与 Collector 边界

Protocol adapter 是纯函数式声明层，只能看到 `request`、`artifacts` 和 `now`。它输出的计划仍需经过 RequestPlan 校验和 Collector policy；任何“签名脚本想直接 POST”的设计都违反分层。

Collector 是唯一真实网络出口。发送前必须完成：绝对 URL、方法、header/body 限制、origin allowlist、credential 注入和代理策略校验。凭据对象的默认字符串化、JSON 和错误信息必须脱敏。连接/代理失败可以按 retry policy 重试；业务请求已经写出后，未知结果不得自动重放。

## 可验证的安全契约

以下测试是边界回归的一部分：

- `tests/gate5-end-to-end-test.js`：目标脚本无真实网络、Protocol 无 IO、Collector allowlist 阻止外发；
- `tests/script-policy-test.js` 与 `tests/script-policy-integration-test.js`：脚本类别、来源、module 依赖和拒绝事件；
- `tests/evidence-contract-test.js`、`tests/evidence-signature-test.js`、`tests/whole-audit-evidence-options-test.js`：Evidence 契约、签名信任策略与高层入口贯通；
- `tests/protocol-artifact-test.js`：adapter 上下文不暴露 transport/Collector；
- `tests/collector-test.js` 与 `tests/collector-websocket-test.js`：唯一出口、代理/凭据脱敏、重试和 WebSocket 生命周期；
- `tests/whole-audit-host-test.js`、`tests/whole-audit-surface-test.js`、`tests/whole-audit-closeout-test.js`、`tests/whole-audit-collector-test.js`：生命周期、双后端 surface、Worklet/模块图与 Collector 会话边界；
- `tests/test-hygiene-test.js`：固定等待、越界依赖和敏感实现耦合的静态检查。

明确不承诺的范围（避免把测试通过误读为形式化安全证明）：

- 不对全部 Web API 做 WPT 级一致性验证；行为基准是仓库内 fixtures 针对真实 Edge 的探针与对照测试；
- `vm.Context` 不是抵抗任意恶意脚本或 V8/Node 逃逸的形式化边界，生产须使用进程隔离与最小权限；
- 公共后端（child-process / worker-thread）的证据签名只接受可序列化的 PEM/DER 字符串；KeyObject 等宿主对象仅限进程内 `createNv8` 入口。

新增能力必须同时说明：拥有该能力的组件、输入是否可信、是否可产生 IO、错误如何诊断，以及 reset/dispose 后是否仍有句柄或待处理工作。
