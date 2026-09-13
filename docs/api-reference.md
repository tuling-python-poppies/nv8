# NV8 公共 API 参考

本文档只描述当前 package root（`nv8`）、`nv8/protocol` 和 `nv8/collector`
实际导出的 API。内部模块路径不是稳定公共入口；需要扩展运行时的调用方应优先使用
Profile、插件、Protocol 和 Collector 的公开对象，而不是直接操作 `src/engine/`。

## 设计边界

NV8 分为两个相互配合但权限不同的部分：

- Runtime/Sandbox：在隔离 Realm 中执行 JavaScript 和浏览器表面；目标脚本不能访问
  `process`、`require`、`fs`、真实网络或 Collector 句柄。
- Protocol：把 Runtime 产出的 Artifact 转换为声明式 `RequestPlan`，只做数据变换，
  不拥有 socket、代理、凭据和重试能力。
- Collector：唯一允许真实网络出口的层。每次请求都必须经过 NetworkPolicy；凭据由
  调用方配置，在策略通过后才注入，且不会返回给 Runtime 或 Protocol。

Evidence、脚本策略和 Plugin Lock 是输入边界，不应把私钥、明文凭据或未审计的真实
网络能力放进页面脚本。

## package root

```js
import {
  createNv8,
  nv8Eval,
  minimalPreset,
  domPreset,
  createProfile,
  protocol,
  collector,
} from 'nv8';
```

### `createNv8(options)`

创建一个异步初始化的 NV8 实例。插件解析、Profile 能力检查、Lock Plan 生成和
Sandbox 初始化都在返回 Promise 前完成；required 能力缺失会在 Realm 创建前失败。

常用选项：

| 选项 | 类型 | 说明 |
|---|---|---|
| `appId` | `string` | 诊断用实例标识 |
| `plugins` | `Plugin[]` | 显式插件列表；省略时使用 Profile 或默认 preset |
| `profile` | `string\|object` | Profile ID 或自定义 Profile |
| `profileId` | `string` | Profile ID 的显式形式 |
| `runtimeMode` | `'legacy'\|'plugin'` | 运行时装配路径，默认 `legacy` |
| `replay` | `object[]` | Realm 内 Fetch/XHR 等离线回放记录 |
| `evidence` | `object` | Evidence Bundle 配置；脚本策略独立校验 |
| `limits` | `object` | Realm、Worker、输出、状态等资源限制 |
| `capabilityPolicy` | `'degrade'\|'strict'\|'ignore'` | optional 能力缺失处理方式 |
| `pluginLockPlan` | `object` | 预期 Lock Plan；不匹配时 fail closed |
| `trace` | `boolean` | 是否启用 Core 日志追踪 |
| `logger` | `object` | 可注入 `info/warn/error/trace` 方法 |

状态配额可通过 `limits` 配置：

```js
const nv8 = await createNv8({
  profile: 'dom-replay',
  limits: {
    maxRealms: 12,
    maxWorkerRealms: 64,
    maxWorkerConnections: 128,
    maxStateContexts: 256,
    maxStateKeysPerStore: 4096,
    maxStateTotalKeys: 65536,
  },
});
```

### `Nv8Instance`

`createNv8()` 返回对象包含：

- `sandbox`：底层 Sandbox API，提供 Realm、诊断、资源和生命周期操作；
- `lockPlan`：本次解析出的可序列化 Plugin Lock Plan；
- `hostCapabilities`：宿主能力三态报告；
- `capabilityResolution`：Profile required/optional 能力的实际解析结果；
- `runtimeMode`：实际装配模式；
- `createRealm(options)`：创建 Realm，返回其 global 对象；
- `eval(code, options)`：创建临时 Realm 求值，完成后自动销毁；
- `destroy()`：销毁 Sandbox，幂等；
- `inspect()`：返回不含脚本私密状态的调试摘要。

```js
const instance = await createNv8({ profile: 'minimal-fetch' });
try {
  const global = await instance.createRealm({ type: 'root' });
  const answer = await instance.eval('1 + 2');
  console.log(answer);
  console.log(instance.inspect());
} finally {
  await instance.destroy();
}
```

Realm `type` 当前包括 `root`、`iframe`、`worker` 和 `worklet`。Realm、模块缓存、
浏览器 API 状态和生命周期代数都按 Realm 隔离；销毁或 reset 后不得复用旧 Realm
模块实例。

### `nv8Eval(code, options)`

`createNv8()` + 临时求值 + `destroy()` 的便捷封装。适合一次性、无状态的计算；
需要多次求值、读取诊断或复用热 Realm 时应直接保留 `Nv8Instance`。

```js
const result = await nv8Eval('navigator.userAgent', {
  profile: 'minimal',
});
```

### Profile 与 preset

Root 导出 `minimalPreset`、`basicPreset`、`domPreset`、`networkPreset`、
`fullPreset` 和 `defaultPreset`，也导出 `createProfile()`、`profiles`、
`generateProfileLockPlan()`、`validateLockPlan()` 以及能力策略。

内置 Profile 包括：

- `minimal`：WebIDL、错误、内建对象和 Console；
- `minimal-fetch`：增加离线 Fetch；
- `dom-replay`：DOM、Storage、Fetch/XHR 离线回放；
- `legacy-full`：迁移期全量兼容入口，保持 experimental，只接受 bugfix/parity
  维护，不是 plugin 覆盖率目标；
- `browser-profile-edge-v150`：Edge 150 指纹 Profile。

Profile 的 required 能力缺失会启动失败；optional 能力默认记录显式 degradation，
不会伪造成可用。`legacy-full` 还必须通过其兼容插件和 baseline 维护策略校验。

## Protocol API

```js
import {
  ArtifactKind,
  createRuntimeArtifact,
  createArtifactSet,
  createRequestPlan,
  defineProtocolAdapter,
  createProtocolRegistry,
  createTransform,
} from 'nv8/protocol';
```

核心流程是：

1. `createRuntimeArtifact()` 创建带 schema、过期时间和 digest 的不可变 Artifact；
2. `createArtifactSet()` 对 Artifact 数量和字节数设上限；
3. `defineProtocolAdapter()` 声明所需 Artifact 和纯函数 `plan(context)`；
4. `createTransform()` 创建声明式 header/query/body/cookie 变换；
5. `createProtocolRegistry()` 应用 adapter，检测跨 adapter 冲突并输出 Result；
6. 将 Result 的 `plan` 交给 Collector，而不是在 adapter 内发请求。

Adapter 的 `context` 只有 `request`、`artifacts` 和 `now`。Protocol schema 当前为
`1.0`；同主版本旧 minor 可以消费，未来 minor 或不同 major 返回
`PROTOCOL_SCHEMA_UNSUPPORTED`。它与 Artifact schema、Frame Protocol 和 Core SemVer
相互独立。

```js
const artifact = createRuntimeArtifact({
  id: 'target.signature',
  kind: ArtifactKind.SIGNATURE,
  value: 'signed-value',
  producer: 'target-script',
});
const artifacts = createArtifactSet();
artifacts.add(artifact);

const adapter = defineProtocolAdapter({
  id: 'target-adapter',
  version: '1.0.0',
  consumes: [{ id: 'target.signature' }],
  plan: ({ artifacts: input }) => [
    createTransform('set-header', {
      name: 'x-signature',
      value: input.require('target.signature').value,
    }),
  ],
});

const result = createProtocolRegistry([adapter]).apply({
  request: createRequestPlan({ method: 'GET', url: 'https://target.test/api' }),
  artifacts,
});
```

Protocol 不接受相对 URL、危险 header 值、非法 cookie 或安全方法 body；所有输出都
应可序列化并带稳定摘要。

## Collector API

```js
import {
  createCollector,
  createFetchTransport,
  createWebSocketTransport,
  createMemoryResultSink,
  createFileCheckpointStore,
} from 'nv8/collector';
```

### 创建和发送

```js
const collector = createCollector({
  transport: createFetchTransport(),
  policy: {
    enabled: true,
    allowedOrigins: ['https://target.test'],
  },
  credentials: {
    origins: {
      'https://target.test': {
        headers: { authorization: 'Bearer configured-secret' },
      },
    },
  },
  retry: { maxAttempts: 3, baseDelayMs: 200 },
});

try {
  const response = await collector.send(plan);
  console.log(response.response.status, response.attempts);
} finally {
  await collector.dispose();
}
```

Collector 的安全默认值：网络未显式开启时全部拒绝；allowlist 检查先于凭据注入和
Transport IO；凭据按精确 origin 绑定并在 `describe()`、审计和错误中显示为
`[redacted]`；Protocol/策略错误永不重试；非幂等方法默认不重试。业务消息已经写出
后，WebSocket 失败默认不可重放。

Collector 还提供：

- `PaginationScheduler`：按 cursor 增量分页；检测重复 cursor、空页、页数和条目上限；
- `createMemoryResultSink()` / `createNdjsonResultSink()`：批量写入、显式 key 去重、
  `close()` 冲干；NDJSON 损坏末行可跳过并计数；
- `createMemoryCheckpointStore()` / `createFileCheckpointStore()`：任务指纹绑定、
  原子文件写、损坏检查点回退为重新开始；
- `createProxyTransport()`：显式代理池、HTTP CONNECT/SOCKS5、代理健康和限流；
- `createWebSocketTransport()`：有界 RFC 6455 请求/响应交换，不承担后台订阅重连。

Collector 的 `dispose()` 是终止边界；发送中的请求、审计和会话 Cookie 不应在销毁后
继续使用。Collector 会话 Cookie 与 Realm 内 `document.cookie` 完全隔离。

## 错误和生命周期

调用方应按错误层级处理，而不是用错误消息猜测是否可重试：

- Profile/Plugin/能力错误：配置或宿主不满足，修正配置后重建实例；
- `ERR_NV8_*_POLICY`、`ORIGIN_NOT_ALLOWED`、`CREDENTIAL_NOT_FOUND`：策略拒绝，永不重试；
- `REQUEST_FAILED`、`REQUEST_TIMEOUT`：查看 `retryable` 和 attempts；
- `RETRY_EXHAUSTED`：保留 attempts 和审计记录，由上层决定是否重新编排；
- `ERR_NV8_MODULE_EVALUATION_CANCELLED`：Realm 已销毁或 generation 失效，旧 Promise
  不得重新注入资源。

所有 `destroy()`、`close()` 和 Collector `dispose()` 调用都应设计为幂等。真实网络、
凭据、代理和数据库驱动不应从页面脚本或 Protocol adapter 透传到 Realm。

## 稳定性说明

公开行为以测试和文档契约为准。Node 18/20 的 Window 枚举顺序、V8 内建对象顺序和
部分 ICU/布局结果属于宿主限制，已在兼容性文档和 known differences 中登记；不能
通过伪造结果宣称完全对等。Edge fixture 采集工具只用于一次性校准，不是 NV8 运行时
依赖。
