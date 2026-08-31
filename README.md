# NV8

NV8 is an Edge-compatible, browser-free JavaScript sandbox for isolated
execution of browser-facing code.

> **🔧 重构进行中**: NV8 正在进行架构改造，从单体结构迁移到插件化架构。查看 [架构改造计划.md](./docs/架构改造计划.md) 了解详情。
>
> **当前状态**: Phase 5 基础实现完成 ✅ - Evidence Bundle、异步脚本时序和 Network Replay 已实现  
> **最新进展**: 查看 [docs/phase5-summary.md](./docs/phase5-summary.md) 和 [STATUS.md](./STATUS.md)

## Usage

```js
import { createSandbox } from "nv8";

const sandbox = await createSandbox("https://sandbox.test/", {
  replay: {
    "https://sandbox.test/api/status": { ready: true },
  },
});

try {
  const result = await sandbox.run(
    "fetch('/api/status').then(response => response.text())",
  );

  console.log(JSON.parse(result));
} finally {
  await sandbox.close();
  createSandbox.drain();
}
```

All browser networking is explicit offline replay. Unmatched `fetch`, XHR,
Worker, and ServiceWorker requests fail inside the sandbox; no socket is
opened by the runtime.

The package requires Node.js `24.11.0` and exports `createSandbox`,
`edge150Fingerprint`, `edge151Fingerprint`, and `drainWorkerThreadPool`.

## Boundary

The sandbox provides a compatibility realm, not a browser or a security
boundary. User code runs in an isolated child process by default. Rendering,
media, device, storage, timing, and browser API behavior are deterministic
in-memory models controlled by explicit options.
