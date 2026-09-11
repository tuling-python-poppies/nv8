# Protocol 与 Collector 边界

本文档定义 NV8 的协议生成层与网络出口层的职责划分。这是框架的核心安全边界。

## 为什么要分层

目标脚本是不可信的。它需要一个足够真实的浏览器环境才能算出签名，
但绝不应该因此获得访问真实网络的能力。

因此签名计算与请求发出被拆成两层：

```
Evidence Bundle (离线证据)
  → Runtime        执行目标 JS，产出 Artifact
  → Protocol       Artifact → RequestPlan（纯变换，无 IO）
  → Collector      执行 RequestPlan（唯一网络出口，受策略约束）
```

每一层只能向下传递数据，不能向上索取能力。

## 四种数据契约

| 契约 | 生产者 | 消费者 | 特性 |
|------|--------|--------|------|
| `RuntimeArtifact` | Runtime | Protocol | 只读、canonical JSON、带 schema 版本和摘要 |
| `RequestTransform` | Protocol adapter | Protocol registry | 声明式、可审计、可检测冲突 |
| `RequestPlan` | Protocol | Collector | 只读、已归一化、含摘要 |
| `CollectorResult` | Collector | 调用方 | 含响应、尝试记录和脱敏审计 |

## Runtime Artifact

工件是 Runtime 与 Protocol 之间唯一的数据通道。

```js
import { createRuntimeArtifact, ArtifactKind } from 'nv8/protocol';

const signature = createRuntimeArtifact({
  id: 'target.signature',
  kind: ArtifactKind.SIGNATURE,
  value: 'a1b2c3d4',
  producer: 'target-signer-script',
  expiresAt: Date.now() + 60_000,
});
```

约束：

- `value` 必须是 canonical JSON 可表示的。函数、Symbol、`NaN`、循环引用
  会在创建时抛错，而不是在摘要阶段静默产生不确定结果。
- `id` 是稳定标识，供 adapter 引用。
- `expiresAt` 过期后禁止参与请求变换，宁可失败也不发出错误签名。
- 创建后被 `Object.freeze`，并附带 `digest` 和 `byteLength`。

`ArtifactSet` 提供有界集合：超过 `maxArtifacts`、`maxArtifactBytes` 或
`maxTotalBytes` 时抛结构化错误，不静默丢弃。

### schema 兼容规则

`schemaVersion` 形如 `major.minor`：

- major 不同 → 拒绝消费
- 工件 minor 高于消费者 minor → 拒绝消费
- 工件 minor 低于或等于消费者 → 接受

## Protocol Adapter

适配器承载站点专属逻辑，但被限制在一个极窄的接口内。

```js
import { defineProtocolAdapter, createTransform } from 'nv8/protocol';

const adapter = defineProtocolAdapter({
  id: 'target-signer',
  version: '1.0.0',
  consumes: [{ id: 'target.signature' }],
  plan: ({ request, artifacts, now }) => [
    createTransform('set-header', {
      name: 'X-Signature',
      value: artifacts.require('target.signature').value,
    }),
  ],
});
```

`plan(context)` 的 context 只有三个键：`request`、`artifacts`、`now`。
适配器拿不到 socket、`fs`、凭据或 Collector 句柄——这一点由测试
（`tests/gate5-end-to-end-test.js`）断言，而不是仅靠约定。

### 为什么用声明式 transform

适配器不直接改 `RequestPlan`，而是返回 transform 列表，因为这样可以：

- 审计每个变更的来源（`transform.source` 自动填充适配器 ID）
- 在应用前检测冲突
- 序列化和 diff，用于回归对比

可用 transform：

| kind | 作用 | 可累积 |
|------|------|--------|
| `set-header` / `remove-header` | 设置或删除 header | 否 |
| `append-header` | 追加多值 header | 是 |
| `set-cookie` / `remove-cookie` | 操作 cookie | 否 |
| `set-query` / `remove-query` | 操作 query 参数 | 否 |
| `set-body` | 替换请求体 | 否 |
| `merge-json-body` | 合并 JSON 字段 | 是 |
| `set-form-field` | 设置表单字段 | 否 |
| `set-method` / `set-path` | 改写方法或路径 | 否 |

### 冲突处理

当两个**不同** adapter 设置同一目标时视为冲突，默认拒绝：

```js
registry.apply({ request, artifacts });
// → ERR_NV8_TRANSFORM_CONFLICT

registry.apply({ request, artifacts, allowConflicts: true });
// → 后写入者胜出，冲突记录在 result.conflicts
```

同一 adapter 重复设置同一目标不算冲突（那是它自己的逻辑）。

## Request Plan

`RequestPlan` 是 Protocol 的输出，也是 Collector 的输入。它是纯描述：
没有 socket、agent、凭据或重试逻辑。

归一化规则：

- header 名统一小写，多值用数组保序
- header/cookie 值中的 CR、LF、NUL 直接拒绝（防注入）
- URL 必须是绝对 `http:`、`https:`、`ws:` 或 `wss:`；WebSocket 计划必须显式携带 `metadata.websocket`
- WebSocket 计划只能使用 `GET`，且不携带 HTTP body；普通 HTTP 计划仍按下面的 body 规则校验
- `GET`/`HEAD`/`OPTIONS`/`TRACE` 携带 body 时拒绝
- 输出按 header 名和 cookie 名排序，保证 `digest` 稳定

## Collector

Collector 是**唯一**拥有真实网络出口的组件。

```js
import { createCollector, createFetchTransport } from 'nv8/collector';

const collector = createCollector({
  transport: createFetchTransport(),
  policy: {
    enabled: true,                        // 必须显式开启
    allowedOrigins: ['https://target.test'],
  },
  credentials: {
    origins: {
      'https://target.test': { headers: { authorization: 'Bearer ...' } },
    },
  },
  retry: { maxAttempts: 3, baseDelayMs: 200 },
});

const result = await collector.send(protocolResult.plan);
```

### 网络策略默认拒绝

`NetworkPolicy` 的默认值是 `enabled: false`。不显式开启并配置
`allowedOrigins`，任何请求都会以 `ERR_NV8_COLLECTOR_NETWORK_DISABLED` 失败。

策略检查发生在**任何 IO 之前**，也发生在凭据注入之前。这保证了被拒绝的
请求不会携带凭据，也不会产生任何出网数据包。

支持的 origin 形式：

- 精确：`https://api.target.test`
- 通配子域：`https://*.target.test`（不匹配 `target.test.evil.com`）
- 裸 `*` 被拒绝；确需放开必须显式 `allowAnyOrigin: true`

### 重定向

默认拒绝重定向。开启 `followRedirects` 后，跨 origin 重定向仍需
`allowCrossOriginRedirect: true`，且目标 origin 必须在 allowlist 内。

### 凭据边界

凭据由部署配置提供，**不可**被目标脚本、Evidence manifest 或 Protocol
适配器修改或读取。

- 凭据绑定到精确 origin（scheme 也是 origin 的一部分，
  `http://` 与 `https://` 不通用）
- 只在策略检查通过后注入
- 在审计、`describe()` 和错误消息中始终显示为 `[redacted]`
- 含 CR/LF/NUL 的凭据值在配置阶段就被拒绝

### WebSocket 有界交换

Collector 的 `createWebSocketTransport()` 提供有限的 WebSocket 请求/响应交换：完成 RFC 6455
握手后，可发送有限数量的文本或 base64 二进制消息，并收集有界数量的完整消息。传输处理客户端
掩码、消息分片、Ping/Pong、Close、Abort 和超时；`maxMessageBytes` 与 `maxTotalBytes` 保护
接收内存。发送应用消息后发生的连接失败不会再次重试，因为重试可能重复业务操作。它不承担
长连接订阅、后台重连或代理隧道管理。

WebSocket 必须同时满足三层配置：`ws:`/`wss:` URL、`metadata.websocket` 计划字段，以及
NetworkPolicy 中显式允许的 `ws:`/`wss:` scheme 和 origin。Cookie 的 `Secure` 属性对 `wss:`
视为安全连接。

### 重试语义

| 情况 | 是否重试 |
|------|----------|
| 策略拒绝（allowlist、凭据、方法） | 永不 |
| 配置错误 | 永不 |
| 传输失败且标记 `retryable` | 是 |
| 408/425/429/500/502/503/504 | 是 |
| 非幂等方法（POST/PATCH） | 默认否 |
| 其他 4xx | 否 |

退避默认确定性（`jitterRatio: 0`），便于测试和回归。`Retry-After`
优先于指数退避。

### 会话 Cookie 隔离

Collector 的 `CookieJar` 与 Realm 内的 `document.cookie` 完全隔离。
沙箱脚本读不到采集会话的 cookie，也无法污染它。

优先级：`RequestPlan` 显式 cookie > 会话 jar > 凭据 cookie。

### 审计

每次请求产生一条脱敏记录，含 method、URL、origin、状态码、尝试次数和
错误码。审计条目数受 `maxAuditEntries` 限制，超出后淘汰最早记录。

## 错误码

Protocol 层（`ERR_NV8_ARTIFACT_*`、`ERR_NV8_PROTOCOL_*`、`ERR_NV8_TRANSFORM_*`）
全部是本地确定性失败，不涉及网络。

Collector 层区分两类：

- **策略类**（`ORIGIN_NOT_ALLOWED`、`NETWORK_DISABLED`、`CREDENTIAL_NOT_FOUND`…）
  → `error.isPolicyViolation === true`，永不重试
- **传输类**（`REQUEST_FAILED`、`REQUEST_TIMEOUT`、`RETRY_EXHAUSTED`…）
  → 按 `retryable` 判定

## 不属于本层的职责

Protocol 和 Collector 都**不**负责：

- 浏览器导航、请求捕获、脚本检查（由 Agent MCP 完成，导出 Evidence Bundle）
- 执行 JavaScript 或解析 DOM（由 Runtime 负责）
- 分页、调度、数据落库（Collector 目前只提供单请求执行与会话，
  上层编排尚未实现）

## 测试

```
tests/protocol-artifact-test.js    72 项：canonical JSON、工件、plan、transform、adapter
tests/collector-test.js            50 项：策略、凭据、重试、cookie、审计、生命周期
tests/collector-websocket-test.js   3 项：握手、帧收发、重试与生命周期清理
tests/gate5-end-to-end-test.js      7 项：完整链路与边界断言
```

边界断言包括：沙箱脚本无法获得真实网络响应、适配器 context 不含 IO 能力、
被拒绝的 origin 不产生任何出网数据包。
