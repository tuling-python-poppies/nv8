# Agent Bridge

NV8 提供一个受控的 Agent 会话层，让 pi、Codex、OpenCode 或其他宿主通过同一套接口观察和调整模拟环境。Agent 名称只作为审计元数据，不会因为当前使用的 Agent 自动切换浏览器指纹。

## Node API

```js
import { createAgentSession } from 'nv8/agent';

const session = await createAgentSession({
  agent: {
    agentId: 'pi',
    agentVersion: '1.0',
    agentCapabilities: ['evaluate', 'observe', 'patch'],
  },
  sandbox: {
    page: {
      url: 'https://target.test/',
      html: '<!doctype html><html><body></body></html>',
    },
    proxyTrace: { enabled: true },
  },
});

try {
  const before = session.snapshot;
  const result = await session.evaluate('navigator.userAgent');
  const changed = await session.applyEnvironmentPatch({
    baseVersion: before.environmentVersion,
    reason: '目标读取 screen.width，需要复现采集到的桌面尺寸',
    changes: {
      fingerprint: {
        screen: { width: 1440, height: 900 },
      },
    },
  });
  console.log(result.value, changed.environment.environmentVersion);
} finally {
  await session.close();
}
```

`createAgentSession()` 的顶层输入分为两部分：`agent` 是可审计的身份和能力声明，`sandbox` 是普通 `EdgeSandbox` 选项。

`agentCapabilities` 是仅供审计的建议值：它只记录 agent 声称要做什么，进入会话快照和审计日志，不授予也不限制任何方法。声明 `['observe']` 的 agent 不会因此被禁止调用 `applyEnvironmentPatch`。真正的权限边界完全由下文 EnvironmentPatch 的 patchable 字段白名单强制。如果将来需要细粒度授权（例如只读 agent），应在会话层新增 enforcement，而不是依赖这个字段。

## EnvironmentPatch

补丁必须包含：

- `baseVersion`：乐观并发版本号，必须等于当前 `environmentVersion`；
- `reason`：非空原因，进入审计记录；
- `changes`：只允许 `page`、`fingerprint`、`replay`；
- 可选 `auditId` 和未来失效的 `expiresAt`。

`fingerprint` 是对当前已归一化指纹的已知字段合并，未知路径 fail closed。`page` 和 `replay` 也会经过现有 `normalizeRuntimeOptions()`；不会执行补丁中的 JavaScript。以下字段不能通过补丁改变：`limits`、`execution`、Evidence、Collector 凭据、真实网络策略和脚本策略。

页面补丁使用现有 Realm reset 路径；指纹或回放变化会先创建并校验新的 Sandbox，成功后再关闭旧 Sandbox。每次成功变更生成新版本和审计记录，失败不推进版本。最近 64 个版本可用 `rollback(version)` 回滚。

## Observation

会话提供：

- `evaluate(source)`：在当前 Realm 求值；
- `observe()`：读取环境摘要、Trace、网络捕获和资源摘要；
- `enableTrace()`、`disableTrace()`、`clearTrace()`；
- `watchApis(list)`：复用 NV8 已有 trace hook 的 API 访问断点；
- `openInspector(options)`：child-process 后端打开 Node/V8 Inspector；
- `setPage(page)`：等价于一个带当前版本号的页面补丁；
- `close()`：幂等关闭会话。

Trace 和 API watch 是会话控制，不属于 EnvironmentPatch。Sandbox 重建时会保留它们的会话设置；Worker-thread 后端仍不支持 Inspector 暂停。

## Stdio JSON-RPC

仓库提供单会话、无依赖的 stdio 入口：

```bash
NV8_AGENT_ID=pi \
NV8_AGENT_VERSION=1.0 \
NV8_AGENT_CAPABILITIES=evaluate,observe,patch \
npm run agent:bridge
```

sandbox 配置有两种传入方式：

- `NV8_SANDBOX_OPTIONS`：内联 JSON，适合 `page` 等小配置；
- `NV8_SANDBOX_OPTIONS_FILE`：JSON 文件路径，优先于内联。大 replay/evidence
  配置会撞 Windows 32KB 环境变量上限，必须走文件形式。

每行一个 JSON-RPC 2.0 请求。会话在进程启动时根据 `NV8_SANDBOX_OPTIONS` 创建，响应写到 stdout；目标脚本和网络内容不应被当作 Agent 指令执行。

支持的方法：

```text
session.describe
session.evaluate
session.observe
session.applyEnvironmentPatch
session.rollback
session.enableTrace
session.disableTrace
session.clearTrace
session.watchApis
session.openInspector
session.close
```

例如：

```json
{"id":1,"method":"session.evaluate","params":{"source":"screen.width"}}
{"id":2,"method":"session.applyEnvironmentPatch","params":{"patch":{"baseVersion":0,"reason":"match desktop","changes":{"fingerprint":{"screen":{"width":1440}}}}}}
```

## 安全边界

Agent Bridge 不读取 pi、Codex 或 OpenCode 的内部进程状态，也不根据伪造的环境变量授予高信任权限。`agentCapabilities` 只是审计元数据，不参与鉴权；真正的权限边界是 patchable 字段白名单。外部 Agent、页面脚本、Trace 和网络回放都属于不可信输入。真实网络仍只能由 Collector 层按 NetworkPolicy 和 origin-bound 凭据处理；EnvironmentPatch 不能绕过这些约束。
