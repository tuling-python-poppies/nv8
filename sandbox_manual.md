# Nv8 / EdgeSandbox 操作说明书

本文档面向需要在本机运行浏览器 JavaScript、调试指纹读取、执行离线网络回放或采集请求数据的使用者。

**说明：** 本文档中的 `<nv8-root>` 指 Nv8 的安装目录（本文档所在目录）。在实际使用时，请将 `<nv8-root>` 替换为您的实际安装路径，例如 `/home/user/Nv8` 或 `D:\develop_software\Nv8`。

当前运行基线：

- 支持 Node.js `>=18.18.0`（在 18/20/22/24 四档均有测试；**指纹敏感场景请用 Node 22+**，
  原因见 README「环境要求」）；手册中的直接 Node 命令均带 `--experimental-vm-modules`。
- 默认环境 profile：`edge-compat`，默认指纹目标为 Edge 150。
- 默认执行后端：`child-process`。
- Node 18/20 使用异步 VM module linker；Node 22/24 使用批量链接快速路径。两条路径对公共行为等价。
- Core、插件与隔离后端的验证命令见第 17 节；依赖证据文件的完整审计仅能在证据齐全的开发副本运行。

这个项目是 Node V8 加浏览器兼容层，不是 Chromium renderer，也不是 Microsoft Edge 私有 V8 构建。它适合执行需要浏览器全局对象、DOM/Web IDL、Realm、Worker、确定性时序和离线 replay 的 JavaScript bundle。

## 目录

1. [运行前提](#1-运行前提)
2. [安装和第一次运行](#2-安装和第一次运行)
3. [公共 API](#3-公共-api)
4. [最小可运行示例](#4-最小可运行示例)
5. [EdgeSandbox 配置](#5-edgesandbox-配置)
6. [页面、Realm 和 Worker](#6-页面realm-和-worker)
7. [执行 JavaScript 和返回值](#7-执行-javascript-和返回值)
8. [离线网络 replay](#8-离线网络-replay)
9. [浏览器指纹 profile](#9-浏览器指纹-profile)
10. [时钟和调度 profile](#10-时钟和调度-profile)
11. [能力、设备和渲染 profile](#11-能力设备和渲染-profile)
12. [请求采集和 API Trace](#12-请求采集和-api-trace)
13. [加载本地 JavaScript bundle](#13-加载本地-javascript-bundle)
14. [生命周期、超时和资源限制](#14-生命周期超时和资源限制)
15. [安全边界](#15-安全边界)
16. [调试沙箱子进程](#16-调试沙箱子进程)
17. [测试和审计](#17-测试和审计)
18. [常见问题](#18-常见问题)
19. [能力边界](#19-能力边界)

## 1. 运行前提

### 1.1 Node.js 版本与 VM Modules

运行时要求 Node.js `18.18.0` 或更高版本。当前兼容路径覆盖 Node 18、20、22 和 24；不需要把 PATH 固定到某一个 major version。
**指纹敏感场景请用 Node 22+**：Node 18/20 的 V8 做不到让 Window 全局按插入序枚举，
枚举顺序无法与真实 Edge 一致（详见 README「环境要求」）。

确认当前版本：

```powershell
node --version
```

使用 NVM 时可在支持范围内选择已安装版本：

```powershell
nvm use 18
nvm use 20
nvm use 22
nvm use 24
```

Nv8 使用 `vm.SourceTextModule`。所有 `npm` 测试和构建脚本已经带有 `--experimental-vm-modules`；手动调用 Node 运行 Core、测试或 bundle 构建时必须显式添加该 flag：

```powershell
node --experimental-vm-modules --test tests/node-compat-test.js
node --experimental-vm-modules scripts/build-module-bundle.mjs
```

不要用缺少该 flag 的直接 Node 命令诊断运行时兼容性。

### 1.2 依赖

运行时不依赖浏览器、Chromium、Playwright、Selenium 或 iv8。项目只有开发期 parser 依赖，安装时关闭 npm scripts：

```powershell
npm install --ignore-scripts
```

沙箱执行单元不能导入 Node 内置模块、npm 包、本地文件或网络模块。

### 1.3 不要直接运行目标 bundle

下面的方式会绕过浏览器兼容层和隔离边界，不是正确用法：

```powershell
node .\target-bundle.js
```

正确方式是由宿主 Node 代码读取源文件，再交给 `EdgeSandbox.evaluate()` 或 `evaluateModule()`：

```js
const source = await readFile("./target-bundle.js", "utf8");
const result = await sandbox.evaluate(source);
```

宿主代码负责文件读取；bundle 在沙箱内运行时没有文件系统能力。

## 2. 安装和第一次运行

### 2.1 安装

```powershell
cd <nv8-root>
npm install --ignore-scripts
```

如果依赖已经安装，可直接跳过安装步骤。

### 2.2 导入方式

**仓库内部**使用相对路径：

```js
import { EdgeSandbox } from "./src/public/edge-sandbox.js";
import { createSandbox } from "./src/public/create-sandbox.js";
import { edge150Fingerprint } from "./src/infra/fingerprint/edge-150.js";
```

**作为项目依赖**（`package.json` 声明 `"nv8": "file:<nv8-root>"` 并 `npm install`）时，直接按包名导入：

```js
import {
  EdgeSandbox,
  createSandbox,
  createNv8,
  nv8Eval,
  domPreset,
  edge152Fingerprint,
} from "nv8";
```

顶层 `nv8` 的导出：

| 导出 | 作用 |
| --- | --- |
| `EdgeSandbox` / `createSandbox` | 创建和控制隔离沙箱（子进程边界）|
| `edge150Fingerprint` / `edge151Fingerprint` / `edge152Fingerprint` | 冻结浏览器指纹（与 `nv8/fingerprint/*` 子路径同源）|
| `createNv8` / `nv8Eval` | 面向可裁剪装配的进程内入口 |
| `minimalPreset` / `basicPreset` / `domPreset` / `networkPreset` / `fullPreset` | 插件组合 |
| `*Plugin`（`domCorePlugin`、`fetchPlugin` …）| 单个内置插件 |
| `profiles` / `createProfile` | 内置 profile 与自定义 profile 构造 |
| `generateProfileLockPlan` / `validateLockPlan` | 插件装配的锁定计划 |
| `collector` / `protocol` | 采集层与请求协议层 |

子路径导出（与 `package.json` 的 `exports` 一一对应）：

| 导入路径 | 内容 |
| --- | --- |
| `nv8/fingerprint/edge-150` | Edge 150 冻结指纹 |
| `nv8/fingerprint/edge-151` | Edge 151 冻结指纹 |
| `nv8/fingerprint/edge-152` | 本机 Edge 152 冻结指纹（当前对等性基准） |
| `nv8/protocol` | 请求协议层（`src/collection/request-protocol/`）|
| `nv8/collector` | 采集层（`src/collection/collector/`）|

`EdgeSandbox` / `createSandbox` 与三个指纹都在顶层导出里；`nv8/fingerprint/*`
子路径保留给只需要指纹的调用方，两者同源。仓库内部（未装依赖）仍可用相对路径导入。

### 2.3 第一次验证

```bash
npm test                    # 全量（`node --test` 自动发现 tests/）
npm run test:matrix         # Node 18 / 20 / 22 / 24 四档
```

也可以直接运行单个测试文件：

```bash
node --experimental-vm-modules --test tests/fingerprint-calibration-test.js
```

其余校验入口：

```bash
npm run audit:state         # 模块级可变状态审计
npm run check:surface-order  # Window 全局顺序表与采集 fixture 一致
npm run capabilities        # 宿主能力三态报告
npm run baseline            # 重新生成基线快照
```

项目只保留通用离线 replay、网络捕获和浏览器兼容性验证。

## 3. 公共 API

### 3.1 创建

```js
const sandbox = await EdgeSandbox.create(options);
```

`create()` 会校验配置、启动执行后端、创建初始页面 Realm，并完成浏览器兼容层引导。

### 3.2 执行脚本

```js
const result = await sandbox.evaluate(source);
```

`source` 必须是字符串，大小不能超过 `limits.maxSourceBytes`。

`batchEvaluate()` 会在同一个当前页面 Realm 中按给定顺序执行多个字符串，并返回同样顺序的结果：

```js
const results = await sandbox.batchEvaluate([
  "globalThis.counter = 1",
  "globalThis.counter + 1",
]);
```

### 3.3 执行模块

```js
const result = await sandbox.evaluateModule(
  source,
  "https://sandbox.test/main.mjs",
);
```

模块 URL 用于模块身份和相对 URL 解析。模块仍然不能导入 Node 模块、本地文件、npm 包或真实网络模块。

### 3.4 替换页面

```js
await sandbox.setPage({
  url: "https://sandbox.test/next",
  html: "<!doctype html><main>Next</main>",
  referrer: "https://sandbox.test/",
  contentType: "text/html",
});
```

`setPage()` 会保存可持久化的 Cookie/Storage 状态，终止旧执行单元，创建新的页面 Realm，然后恢复允许持久化的状态。旧页面中的对象、闭包、定时器和 Worker 不会继续存活。

建议始终传入完整的页面对象，不要依赖上一页字段自动继承。

### 3.5 请求记录

```js
const requests = await sandbox.networkRequests();
sandbox.clearNetworkRequests();
```

`networkRequests()` 返回冻结快照，按请求到达沙箱离线网络边界的顺序排列。

### 3.6 API Trace

```js
await sandbox.enableTrace();
const entries = await sandbox.trace();
await sandbox.disableTrace();
await sandbox.clearTrace();
```

以下方法是别名：

| 主方法 | 别名 |
| --- | --- |
| `enableProxyTrace()` | `enableTrace()` |
| `disableProxyTrace()` | `disableTrace()` |
| `proxyTrace()` | `trace()` |
| `clearProxyTrace()` | `clearTrace()` |

Trace 只观察兼容层 API 调用，不代表真实 Chromium DevTools 调用栈。

### 3.7 关闭

```js
await sandbox.close();
```

`close()` 可以重复调用。关闭后不能再次执行脚本、替换页面、读取 Trace 或读取请求日志。

### 3.8 进程内入口与插件装配

`EdgeSandbox` 是运行不可信代码的入口（子进程边界）。`createNv8` 是进程内 API，
用于可信插件开发、表面验证或结构实验，**不提供 child-process 安全边界**：

```js
import { createNv8, domPreset } from "nv8";

const nv8 = await createNv8({
  plugins: domPreset,
  profile: {
    id: "manual-demo",
    version: "1.0.0",
    name: "Manual demo",
    url: "https://sandbox.test/",
    pageHtml: "<!doctype html><main>ready</main>",
  },
});

try {
  const realm = await nv8.sandbox.createRealm({ type: "root" });
  console.log(realm.evaluate("document.body.textContent"));
} finally {
  await nv8.destroy();
}
```

插件在 Realm 启动前按声明的依赖关系拓扑排序。每个插件提供唯一 `id`、`version`、
`capabilities`、`dependencies`，以及 `install(sandbox, registry, config)` 与
（需要往 Realm 里装表面时）`activate(context)`。

**`install` 与 `activate` 的分工是硬约束**：`install-*` 函数操作的是宿主的
`globalThis`，在 Realm 建立之前跑会污染宿主进程。现代插件用单参数
`install(context)` 只登记元数据/表面预留，真正装表面必须在 `activate` 里经
`context.moduleLoader.importUrlAsync()` 在 Realm 内完成。旧式三参数
`install(sandbox, registry, config)` 仍会被兼容调用（宿主作用域，不会装进
Realm）；显式标记 `legacy: true` 的插件则整段跳过，只保留元数据。
`plugins/canvas` 曾经把安装写在 `install` 里，结果整个插件是个空壳
（加不加它 surface 一模一样），而它还声明了 `canvas.base` 能力。

## 4. 最小可运行示例

在项目里创建一个 runner（项目需先按 §2.2 安装 `nv8`），例如 `run-local.mjs`：

```js
import { EdgeSandbox } from "nv8";

const sandbox = await EdgeSandbox.create({
  page: {
    url: "https://sandbox.test/",
    html: "<!doctype html><main id='app'>Ready</main>",
  },
});

try {
  const result = await sandbox.evaluate(`
    JSON.stringify({
      title: document.title,
      url: location.href,
      language: navigator.language,
      screen: [screen.width, screen.height],
    })
  `);

  console.log(JSON.parse(result.value));
} finally {
  await sandbox.close();
}
```

运行：

```powershell
node run-local.mjs
```

在支持显式资源管理的 Node 版本中，也可以使用：

```js
await using sandbox = await EdgeSandbox.create();
const result = await sandbox.evaluate("1 + 2");
console.log(result.value);
```

## 5. `EdgeSandbox` 配置

### 5.1 配置总览

```js
const sandbox = await EdgeSandbox.create({
  page: {
    url: "https://sandbox.test/",
    html: "<!doctype html><html><body></body></html>",
    referrer: "",
    contentType: "text/html",
  },
  limits: {
    timeoutMs: 1_000,
    maxHeapBytes: 512 * 1024 * 1024,
    maxSourceBytes: 1024 * 1024,
    maxHtmlBytes: 4 * 1024 * 1024,
    maxOutputBytes: 1024 * 1024,
    maxPayloadBytes: 8 * 1024 * 1024,
    maxRealms: 12,
  },
  execution: {
    backend: "child-process",
  },
  environment: {
    profile: "edge-compat",
  },
  proxyTrace: {
    enabled: false,
    mirrorToConsole: false,
    maxEntries: 100_000,
  },
  networkCapture: {
    enabled: true,
    maxEntries: 1_000,
    maxBodyBytes: 1024 * 1024,
    maxHeaderBytes: 64 * 1024,
    maxTotalBytes: 4 * 1024 * 1024,
  },
  replay: [],
  fingerprint: {},
});
```

所有受支持的配置字段会在启动执行单元前校验。类型错误、越界数值、重复 replay 记录或不支持的字段值会使 `create()` 拒绝。

### 5.2 页面配置

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `page.url` | `https://sandbox.test/` | 页面绝对 URL，也作为相对 URL 的 base |
| `page.html` | 空 HTML 页面 | 初始文档内容 |
| `page.referrer` | `""` | `document.referrer` |
| `page.contentType` | `text/html` | `document.contentType` |

### 5.3 执行后端

默认使用进程隔离：

```js
execution: {
  backend: "child-process",
}
```

可选的 Worker Thread 后端：

```js
execution: {
  backend: "worker-thread",
}
```

`worker-thread` 使用同一 Node 进程内的 `worker_threads` 和独立 V8 Isolate，启动开销可能更低，但不是进程级安全边界。宿主进程级 OOM、原生崩溃或 Node 故障可能影响宿主。

默认生产和不受信任代码场景应保留 `child-process`。

### 5.4 环境 profile

`environment.profile` 决定在隔离后端中安装的浏览器能力集合：

| profile | 安装内容 | 适用场景 |
| --- | --- | --- |
| `edge-compat` | 默认完整 Window、DOM、Fetch、Canvas、Worker、Storage、设备与渲染兼容层 | 需要现有 Edge 兼容表面的 bundle |
| `web-foundation` | Console、Timers、DOMException、Events、URL 与 Text Encoding | 不需要 DOM 或网络的轻量 Web 脚本 |
| `minimal` | ECMAScript、模块、Promise 驱动与 Node-global 审计 | 纯 JavaScript 或插件基础验证 |

`edge-compat` 是默认值。两个较小的 profile 仍经 `child-process` 或显式选择的 `worker-thread` 运行；它们不因缩小 API 表面而改变隔离模型。`minimal` 不安装 `console`、timer、URL、`document` 或浏览器 API。

## 6. 页面、Realm 和 Worker

### 6.1 iframe

同源 iframe 会创建独立的完整 Realm：

```js
const result = await sandbox.evaluate(`
  (() => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    return JSON.stringify({
      independentArray: iframe.contentWindow.Array !== Array,
      independentJSON: iframe.contentWindow.JSON !== JSON,
      childURL: iframe.contentWindow.location.href,
    });
  })()
`);

console.log(JSON.parse(result.value));
```

iframe 的 `Array`、`JSON`、错误对象、DOM 构造器和回调来自子 Realm。父页面后来新增的全局变量不会自动复制到子 Realm。

跨源 iframe 使用受限的普通对象 facade，不是原生浏览器 `WindowProxy` exotic object。具体差异见 [能力边界](#19-能力边界)。

### 6.2 DedicatedWorker

Worker 脚本必须从以下来源之一加载：

1. 配置在 `replay` 中的绝对 URL；
2. 当前沙箱创建的、尚未失效的 Blob URL；
3. 受支持的 `data:` URL。

示例：

```js
const workerUrl = "https://sandbox.test/worker.js";
const sandbox = await EdgeSandbox.create({
  page: { url: "https://sandbox.test/" },
  replay: [{
    method: "GET",
    url: workerUrl,
    body: `
      self.onmessage = event => {
        self.postMessage(event.data * 2);
      };
    `,
  }],
});

try {
  const result = await sandbox.evaluate(`
    new Promise((resolve, reject) => {
      const worker = new Worker(${JSON.stringify(workerUrl)});
      worker.onmessage = event => resolve(event.data);
      worker.onerror = reject;
      worker.postMessage(21);
    })
  `);
  console.log(result.value); // 42
} finally {
  await sandbox.close();
}
```

DedicatedWorker、嵌套 Worker、SharedWorker 和 ServiceWorker 遵守相同的离线来源规则。Navigator、UA-CH、屏幕相关可用字段、渲染 profile 和时序 profile 会按支持范围传播到子 Realm。

### 6.3 Blob URL Worker

Blob URL 内容只存放在当前沙箱内存中：

```js
const source = `
  self.onmessage = event => self.postMessage(event.data * 2);
`;
const blob = new Blob([source], { type: "text/javascript" });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl);
URL.revokeObjectURL(workerUrl);
```

Worker 构造已经取得脚本快照后，撤销 URL 不会终止已经启动的 Worker；撤销后新建 Worker 会失败。Blob URL 不访问文件系统或真实网络。

## 7. 执行 JavaScript 和返回值

### 7.1 基础类型

```js
const result = await sandbox.evaluate("1 + 2");
console.log(result);
// { type: "number", value: 3 }
```

可直接跨 IPC 返回的类型：

- `undefined`
- `null`
- `boolean`
- `number`
- `string`

Promise 会等待结算：

```js
const result = await sandbox.evaluate(`Promise.resolve("done")`);
console.log(result.value); // done
```

### 7.2 复杂值

对象、数组、函数、DOM 节点和其他复杂对象不会作为原对象跨进程传输：

```js
const result = await sandbox.evaluate(`({ ready: true })`);
console.log(result.type);  // other
console.log(result.value); // undefined
```

需要返回结构时，在沙箱内序列化：

```js
const result = await sandbox.evaluate(`
  JSON.stringify({
    url: location.href,
    userAgent: navigator.userAgent,
    screen: [screen.width, screen.height],
  })
`);

const value = JSON.parse(result.value);
```

二进制数据、循环对象和带有不可序列化成员的对象，应在沙箱内转换为 Base64、数组或其他字符串格式。

### 7.3 脚本和模块限制

沙箱内 JavaScript 不能：

- `import` Node 内置模块；
- 读取任意本地路径；
- 创建真实 TCP/TLS/HTTP 连接；
- 读取宿主进程的 `process`、环境变量或文件句柄；
- 通过动态构造器绕过 Node-global 隐藏；
- 使用页面代码直接调用外部 Python 或 Node API。

需要文件或网络的操作必须由宿主 runner 明确完成，并通过字符串、replay 或结构化参数交给沙箱。

## 8. 离线网络 replay

### 8.1 配置一条 replay

```js
const sandbox = await EdgeSandbox.create({
  page: {
    url: "https://api.example/",
  },
  replay: [{
    method: "GET",
    url: "https://api.example/users/1",
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      name: "Ada",
    }),
    redirected: false,
    type: "basic",
  }],
});
```

字段：

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `method` | `GET` | 自动转大写 |
| `url` | 无 | 必须是有效绝对 URL，启动时标准化 |
| `status` | `200` | 整数，范围 200–599 |
| `statusText` | `""` | 响应状态文本 |
| `headers` | `{}` | 字符串键值对象 |
| `body` | `""` | UTF-8 字符串 |
| `redirected` | `false` | Response 的 redirected 状态 |
| `type` | `basic` | Response type 字符串 |

同一个 `method + 标准化 URL` 不能出现重复 replay 记录。最多配置 10,000 条记录，所有 body 合计受 `limits.maxPayloadBytes` 约束。

### 8.2 Fetch 和 XHR

```js
const result = await sandbox.evaluate(`
  fetch("/users/1")
    .then(response => response.json())
    .then(value => JSON.stringify(value))
`);

console.log(JSON.parse(result.value));
```

页面中的相对 URL 会根据 `page.url` 解析。请求必须匹配 replay 的方法和标准化 URL；未匹配时 `fetch()` 会以 `TypeError` 拒绝，不会转为真实请求。

`XMLHttpRequest` 使用同一套 replay：

```js
await sandbox.evaluate(`
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/users/1");
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = reject;
    xhr.send();
  })
`);
```

### 8.3 Worker 脚本 replay

Worker 脚本本身也可以用 `GET` replay 提供：

```js
replay: [{
  method: "GET",
  url: "https://sandbox.test/worker.js",
  body: "self.onmessage = event => self.postMessage(event.data);",
}]
```

这条记录既作为脚本来源，也会按照网络边界记录为请求。脚本不应依赖真实 CDN、文件系统或外部网络。

### 8.4 请求记录

```js
const requests = await sandbox.networkRequests();

for (const request of requests) {
  console.log({
    api: request.api,
    context: request.context,
    method: request.method,
    url: request.url,
    outcome: request.outcome,
    bodyText: request.bodyText,
    bodyBase64: request.bodyBase64,
    bodyByteLength: request.bodyByteLength,
  });
}
```

记录主要字段：

| 字段 | 说明 |
| --- | --- |
| `sequence` | 全局递增序号 |
| `api` | `fetch` 或 `XMLHttpRequest` |
| `context` | Window、iframe、Worker 等来源上下文 |
| `method` | 进入 Request 管线后的最终方法 |
| `url` | 最终 URL |
| `headers` | 规范化后的请求头键值对 |
| `body` | `Uint8Array` 字节视图 |
| `bodyText` | UTF-8 便捷视图，二进制不应依赖它 |
| `bodyBase64` | 无损的 Base64 视图 |
| `bodyByteLength` | 原始完整 body 长度 |
| `outcome` | `replayed`、`blocked` 或 `aborted` |

`blocked` 表示没有匹配 replay，不表示发生了真实网络拒绝。沙箱始终不会打开 socket。捕获到的 header 只代表应用层 Request 数据，不虚构 TLS、代理、Chromium 网络进程自动添加的字段。

### 8.5 捕获容量

```js
networkCapture: {
  enabled: true,
  maxEntries: 1_000,
  maxBodyBytes: 1024 * 1024,
  maxHeaderBytes: 64 * 1024,
  maxTotalBytes: 4 * 1024 * 1024,
}
```

超出容量时按项目的有界记录策略处理。二进制请求必须使用 `body` 或 `bodyBase64`，不能把 `bodyText` 当作无损结果。

## 9. 浏览器指纹 profile

### 9.1 使用默认 Edge 150 profile

```js
import { EdgeSandbox } from "./src/public/edge-sandbox.js";
import { edge150Fingerprint } from "./src/infra/fingerprint/edge-150.js";

const sandbox = await EdgeSandbox.create({
  fingerprint: edge150Fingerprint,
});
```

不传 `fingerprint` 也会使用等价的默认 Edge 150 profile。

`edge150Fingerprint` 及其嵌套对象被冻结，不能原地修改。应复制后覆盖：

```js
const fingerprint = {
  ...edge150Fingerprint,
  navigator: {
    ...edge150Fingerprint.navigator,
    language: "en-US",
    languages: ["en-US", "en"],
  },
};
```

### 9.2 浏览器 major version

Edge 150 是默认值：

```js
fingerprint: {
  browserMajorVersion: 150,
}
```

Edge 151 只能显式 opt-in：

```js
fingerprint: {
  browserMajorVersion: 151,
}
```

当前只接受 `150` 和 `151`。如果自定义 UA，必须满足：

- 包含对应版本的 `Chrome/150.` 或 `Chrome/151.`；
- 不包含 `Edg/` token；
- 不把 Edge 151 profile 与 Chrome/150 UA 混用。

151 profile 只提供已验证的 JavaScript-visible additions，包括：

- `FontFaceSet` 相关表面；
- `WheelEvent.prototype.momentum`；
- `TransitionEvent.prototype.animation`；
- `AnimationEvent.prototype.animation`；
- `PerformanceNavigationTiming.navigationId`；
- `Intl.v8BreakIterator` 的兼容 adapter；
- Edge 151 观测到的 `Error.stackTraceLimit` descriptor。

这不是完整 Edge 151、Chromium 或 V8 版本切换。没有证据的 API 不会因为设置 `151` 而伪造出来。

### 9.3 Navigator 和 UA-CH

```js
const fingerprint = {
  ...edge150Fingerprint,
  navigator: {
    ...edge150Fingerprint.navigator,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
      + "AppleWebKit/537.36 (KHTML, like Gecko) "
      + "Chrome/150.0.0.0 Safari/537.36",
    platform: "Win32",
    languages: ["zh-CN", "zh"],
    language: "zh-CN",
    hardwareConcurrency: 8,
    deviceMemory: 8,
    vendor: "Google Inc.",
    maxTouchPoints: 0,
    doNotTrack: null,
    cookieEnabled: true,
    webdriver: false,
    pdfViewerEnabled: true,
    userAgentData: {
      architecture: "x86",
      bitness: "64",
      model: "",
      platformVersion: "19.0.0",
      wow64: false,
      formFactors: ["Desktop"],
      mobile: false,
    },
    plugins: [],
    mimeTypes: [],
  },
};
```

主要可观察字段：

| 配置位置 | 浏览器表面 |
| --- | --- |
| `userAgent` | `navigator.userAgent`、`appVersion`、UA-CH 基本信息 |
| `platform` | `navigator.platform` |
| `languages` | `navigator.languages` |
| `language` | `navigator.language` |
| `hardwareConcurrency` | CPU 并发数 |
| `deviceMemory` | 设备内存 |
| `vendor`、`product`、`productSub` | Navigator 元数据 |
| `webdriver` | 自动化标识 |
| `doNotTrack` | DNT 状态 |
| `plugins` | `navigator.plugins` |
| `mimeTypes` | `navigator.mimeTypes` |
| `userAgentData` | UA-CH 高熵值和 `getHighEntropyValues()` |

`plugins` 的配置结构：

```js
plugins: [{
  name: "Example PDF Viewer",
  filename: "example-pdf-viewer",
  description: "Example plugin",
  mimeTypes: [{
    type: "application/example-pdf",
    suffixes: "pdf",
    description: "Example PDF",
    pluginName: "Example PDF Viewer",
  }],
}],
```

独立的 `mimeTypes` 数组使用同样的 MIME 记录结构。插件和 MIME 关系会驱动 `enabledPlugin`。

### 9.4 Screen 和 DPR

```js
const fingerprint = {
  ...edge150Fingerprint,
  screen: {
    ...edge150Fingerprint.screen,
    width: 2560,
    height: 1440,
    availWidth: 2560,
    availHeight: 1400,
    colorDepth: 24,
    pixelDepth: 24,
    devicePixelRatio: 1.25,
    availLeft: 0,
    availTop: 0,
    isExtended: false,
  },
};
```

这些字段驱动 `screen`、`ScreenDetails`、屏幕可用区域、窗口 `devicePixelRatio` 和相关 Worker 可观察 profile。`devicePixelRatio` 的有效范围为 `0.1` 到 `16`，宽高为 `1` 到 `100000` 的安全整数。

### 9.5 WebGL 和 WebGPU

```js
const fingerprint = {
  ...edge150Fingerprint,
  rendering: {
    ...edge150Fingerprint.rendering,
    webglVendor: "Google Inc. (NVIDIA)",
    webglRenderer:
      "ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 Direct3D11)",
    webgpu: {
      ...edge150Fingerprint.rendering.webgpu,
      vendor: "nvidia",
      device: "Configured GPU",
      description: "Deterministic adapter",
      subgroupMinSize: 32,
      subgroupMaxSize: 32,
      isFallbackAdapter: false,
      features: ["texture-compression-bc"],
      limits: {
        ...edge150Fingerprint.rendering.webgpu.limits,
        maxTextureDimension2D: 8192,
      },
    },
  },
};
```

`rendering.webgpu.limits` 只允许默认 profile 已声明的键。未知键会触发 `Unsupported WebGPU limit in fingerprint`。

渲染状态是确定性的内存模型，不会打开真实 GPU、驱动、显示器或图形设备。

## 10. 时钟和调度 profile

### 10.1 配置示例

```js
const fingerprint = {
  ...edge150Fingerprint,
  timing: {
    ...edge150Fingerprint.timing,
    wallClockOffsetMs: 12_345,
    dateNowResolutionMs: 100,
    performanceResolutionMs: 25,
    performanceJitterMs: 2,
    jitterSeed: 0x12345678,
    minimumTimerDelayMs: 20,
    animationFrameIntervalMs: 24,
  },
};

const sandbox = await EdgeSandbox.create({ fingerprint });
```

### 10.2 字段说明

| 字段 | 默认值 | 作用 |
| --- | ---: | --- |
| `timeOriginMs` | `null` | 会话起始时间；为空时由执行单元启动时采样 |
| `wallClockOffsetMs` | `0` | 调整 `Date.now()`、`Date()` 和新建 Date 的 wall clock |
| `dateNowResolutionMs` | `0` | 对 Date wall clock 做毫秒量化；0 表示不量化 |
| `performanceResolutionMs` | `0` | 对 `performance.now()` 做量化；0 表示不量化 |
| `performanceJitterMs` | `0` | 在 performance 时间上加入确定性 jitter 振幅 |
| `jitterSeed` | `0x4e5638` | 可复现 jitter 的种子 |
| `minimumTimerDelayMs` | `0` | timer 调度的最小延迟 |
| `animationFrameIntervalMs` | `16` | `requestAnimationFrame` 的模拟帧间隔 |

`dateNowResolutionMs` 必须是 `0` 到 `60000` 的整数。`performanceResolutionMs` 为 `0` 到 `60000` 的有限数字。`performanceJitterMs` 为 `0` 到 `1000` 的有限数字。`animationFrameIntervalMs` 为 `1` 到 `1000` 的有限数字。

### 10.3 验证时钟

```js
const result = await sandbox.evaluate(`
  JSON.stringify({
    dateNow: Date.now(),
    dateString: new Date().toISOString(),
    timeOrigin: performance.timeOrigin,
    performanceNow: performance.now(),
  })
`);

console.log(JSON.parse(result.value));
```

默认 profile 保持 Edge 150 基线：不引入随机噪声、不强行替换 Date 函数语义。显式设置 wall clock 偏移或 Date 分辨率后，才安装 Date adapter；这也是推荐的 profile 使用方式。

### 10.4 时序边界

该 profile 只控制 JavaScript 可观察的时钟和调度近似，不能保证真实浏览器的：

- Blink renderer 任务队列顺序；
- 操作系统 timer 精度；
- V8 GC/JIT 暂停；
- GPU 合成帧；
- 浏览器进程、渲染进程和网络进程之间的调度。

不要把 `performanceJitterMs` 当作真实 Edge anti-detection 或硬件计时器等价物。

## 11. 能力、设备和渲染 profile

所有能力 profile 都是内存状态，默认不会访问真实设备。

### 11.1 网络能力

```js
fingerprint: {
  capabilities: {
    network: {
      online: true,
      effectiveType: "4g",
      rtt: 50,
      downlink: 100,
      saveData: false,
    },
  },
}
```

对应：`navigator.onLine` 和 `navigator.connection`。它只改变页面可见状态，不会开启网络连接。

`effectiveType` 只能是 `slow-2g`、`2g`、`3g` 或 `4g`。

### 11.2 ServiceWorker

```js
fingerprint: {
  capabilities: {
    serviceWorker: {
      enabled: true,
    },
  },
}
```

`enabled: false` 时，ServiceWorker 表面仍可存在，但 `register()` 会以 `NotSupportedError` 拒绝。`enabled: true` 时，注册是离线生命周期模型，不会安装系统级 ServiceWorker，也不会拦截真实网络。

ServiceWorker 脚本需要通过 `replay` 的 GET 记录提供。

### 11.3 媒体设备和合成采集

```js
fingerprint: {
  capabilities: {
    media: {
      captureEnabled: true,
      devices: [{
        deviceId: "mic-1",
        kind: "audioinput",
        label: "Synthetic microphone",
        groupId: "audio-inputs",
        capabilities: {
          sampleRate: 48000,
          channelCount: 2,
        },
      }],
    },
  },
}
```

`kind` 只能是 `audioinput`、`audiooutput` 或 `videoinput`。默认 `captureEnabled: false`，`getUserMedia()` 会以 `NotFoundError` 拒绝。开启后只生成内存中的合成轨道，不请求系统权限，也不读取摄像头或麦克风。

`audioCodecs`、`videoCodecs` 和 `imageTypes` 控制 WebCodecs、ImageDecoder 和 MediaCapabilities 的支持查询；不会调用系统 codec。

### 11.4 传感器

支持的传感器键：

```text
accelerometer
gravitySensor
linearAccelerationSensor
gyroscope
absoluteOrientationSensor
relativeOrientationSensor
```

不可用时显式设置 `null`：

```js
fingerprint: {
  capabilities: {
    sensors: {
      accelerometer: null,
      gyroscope: null,
    },
  },
}
```

确定性读数示例：

```js
fingerprint: {
  capabilities: {
    sensors: {
      accelerometer: {
        x: 0,
        y: 0,
        z: 9.81,
        frequency: 60,
      },
    },
  },
}
```

传感器事件只使用配置值，不读取物理传感器。

### 11.5 Bluetooth、HID、Serial、USB

这些接口都可以通过 `fingerprint.capabilities.externalDevices` 配置内存设备：

```js
fingerprint: {
  capabilities: {
    externalDevices: {
      bluetooth: {
        available: true,
        devices: [{ id: "bt-1", name: "Synthetic headset" }],
      },
      hid: {
        devices: [{
          vendorId: 0x1234,
          productId: 0x5678,
          productName: "Synthetic HID",
        }],
      },
      serial: {
        ports: [{
          usbVendorId: 0x1234,
          usbProductId: 0x0001,
          label: "Synthetic COM",
        }],
      },
      usb: {
        devices: [{
          vendorId: 0x8086,
          productId: 0x0001,
          manufacturerName: "Configured vendor",
          productName: "Synthetic USB",
          serialNumber: "sandbox-device",
        }],
      },
    },
  },
}
```

`open()`、`close()` 和设备枚举只改变沙箱内存状态，不会连接真实设备或打开 COM 端口。

## 12. 请求采集和 API Trace

### 12.1 创建时启用 API Trace

```js
const sandbox = await EdgeSandbox.create({
  proxyTrace: {
    enabled: true,
    mirrorToConsole: false,
    maxEntries: 10_000,
  },
});
```

运行期间控制：

```js
await sandbox.enableTrace();
await sandbox.evaluate(`navigator.userAgent; document.body`);
const entries = await sandbox.proxyTrace();
await sandbox.disableTrace();
await sandbox.clearProxyTrace();
```

单条 Trace 记录包含：

```js
{
  sequence,
  operation,
  api,
  receiver,
  arguments,
  result,
}
```

Trace 使用固定上限，不会无限增长。它是兼容层观察工具，不是浏览器原生 DevTools 调用栈。

### 12.2 请求采集和 Trace 的区别

- `networkRequests()`：观察 Fetch/XHR 到达离线网络边界后的最终 method、URL、headers 和 body；默认开启。
- `trace()`：观察兼容层 API 的调用；默认关闭。
- 网络请求采集不需要开启 Trace。
- Trace 不会让沙箱获得真实网络权限。

## 13. 加载本地 JavaScript bundle

推荐的宿主 runner：

```js
import { readFile } from "node:fs/promises";
import { EdgeSandbox } from "nv8";

const source = await readFile("<your-project>/bundle.js", "utf8");
const sandbox = await EdgeSandbox.create({
  page: {
    url: "https://target.example/",
    html: "<!doctype html><html><body></body></html>",
  },
});

try {
  const result = await sandbox.evaluate(source);
  console.log(result.type, result.value);
  console.log(await sandbox.networkRequests());
} finally {
  await sandbox.close();
}
```

如果 bundle 是 ES module：

```js
const source = await readFile("<your-project>/bundle.mjs", "utf8");
const result = await sandbox.evaluateModule(
  source,
  "https://target.example/assets/bundle.mjs",
);
```

页面脚本若需要加载额外脚本、Worker 或配置数据，应事先准备对应的 replay 记录。不要在沙箱内尝试 `fs.readFile`、`process.env`、`fetch()` 外部地址或 `import("node:...")`。

### 13.1 外部 HTTP 的正确分层

推荐分成两层：

1. 沙箱内 JavaScript 负责生成签名、Cookie、请求 body 或请求 header；
2. 外部、明确授权的 Node/Python 代码负责真实 HTTP，并把结果作为下一次 replay 或输入传回沙箱。

这样可以同时保持浏览器 JavaScript 环境和 child-process 安全边界。沙箱本身不会自动把 `fetch()` 转成外部 HTTP。

## 14. 生命周期、超时和资源限制

### 14.1 默认限制

| 字段 | 默认值 | 允许范围 |
| --- | ---: | --- |
| `timeoutMs` | `1000` | `1`–`300000` |
| `maxHeapBytes` | `512 MiB` | `32 MiB`–`16 GiB` |
| `maxSourceBytes` | `1 MiB` | `1 B`–`64 MiB` |
| `maxHtmlBytes` | `4 MiB` | `1 B`–`64 MiB` |
| `maxOutputBytes` | `1 MiB` | `1 B`–`64 MiB` |
| `maxPayloadBytes` | `8 MiB` | `1 KiB`–`128 MiB` |
| `maxInFlightRequests` | `32` | `1`–`1024` |
| `maxQueuedBytes` | `16 MiB` | `1 B`–`512 MiB` |
| `maxRealms` | `12` | `1`–`4096` |

调整示例：

```js
const sandbox = await EdgeSandbox.create({
  limits: {
    timeoutMs: 5_000,
    maxHeapBytes: 256 * 1024 * 1024,
    maxSourceBytes: 2 * 1024 * 1024,
    maxHtmlBytes: 8 * 1024 * 1024,
    maxOutputBytes: 2 * 1024 * 1024,
    maxPayloadBytes: 16 * 1024 * 1024,
    maxInFlightRequests: 32,
    maxQueuedBytes: 32 * 1024 * 1024,
    maxRealms: 32,
  },
});
```

### 14.2 超时处理

用户代码超过 `timeoutMs` 时，控制器会终止整个 child process group，并为后续请求启动干净的执行单元。不要依赖超时后的全局变量、DOM 对象、Promise 或 Worker 继续存在。

`maxInFlightRequests` 和 `maxQueuedBytes` 同时限制连接上的 IPC 并发和未完成请求帧大小；超限请求会以 `ERR_EDGE_IPC_LIMIT` 在发送前失败。

Realm 引导和 `setPage()` 使用单独的启动 deadline；不会简单地把初始化阶段无限延长。

### 14.3 关闭模板

```js
const sandbox = await EdgeSandbox.create(options);

try {
  // evaluate、evaluateModule、setPage、读取请求和 Trace
} finally {
  await sandbox.close();
}
```

长时间运行的进程应在每个任务完成后清理沙箱；大量 Realm churn 时优先使用 child-process 生命周期重建，而不是在同一个 Worker Thread 中无限累积模块 Realm。

## 15. 安全边界

### 15.1 默认 child-process

`vm.Context` 只提供 JavaScript Realm 隔离，不是独立安全边界。因此默认后端把执行放到独立 Node child process：

- 用户代码不能直接访问宿主 Node global；
- 控制器可以在超时后杀掉整个执行进程；
- 后续任务可使用干净的新执行进程；
- IPC 对 source、payload、结果和请求记录有大小限制。

不要为了减少启动开销而在不受信任代码场景切换到 `worker-thread`。

### 15.2 明确不提供的宿主访问

以下能力不会打开真实资源：

- 外部 Fetch、XHR、WebSocket、EventSource、WebTransport；
- 文件系统、进程、环境变量和子进程；
- GPU、显示器和图形驱动；
- 摄像头、麦克风和屏幕捕获；
- 系统 codec、声卡和 TTS；
- 物理传感器；
- Bluetooth、HID、Serial 和 USB；
- 系统级 ServiceWorker 网络拦截。

### 15.3 不要把兼容层当作真实浏览器

本地 V8 的结果适合作为：

- 浏览器 JavaScript bundle 的离线执行环境；
- 签名、Cookie、请求 body 和 API 参数的生成环境；
- 固定 replay 的协议调试环境；
- 浏览器可观察字段和 Worker/Realm 关系的测试环境。

它不能证明：

- 真实 Chromium renderer 通过；
- 真实 Edge 私有 V8 intrinsic 通过；
- TLS、HTTP/2、HTTP/3、代理或 ClientHello 指纹一致；
- 真实 GPU、字体、媒体设备或操作系统行为一致；
- 真实浏览器进程和渲染进程调度一致。

## 16. 调试沙箱子进程

调试实际执行页面代码的 child process 前，在调用 `EdgeSandbox.create()` 之前设置环境变量：

```powershell
$env:EDGE_SANDBOX_CHILD_INSPECT_BRK = "9230"
$env:EDGE_SANDBOX_DISABLE_TIMEOUT = "1"
$env:EDGE_SANDBOX_CHILD_STDERR = "1"
node .\run-local.mjs
```

变量说明：

| 环境变量 | 作用 |
| --- | --- |
| `EDGE_SANDBOX_CHILD_INSPECT_BRK=9230` | 使用 `--inspect-brk=127.0.0.1:9230` 启动 child process |
| `EDGE_SANDBOX_DISABLE_TIMEOUT=1` | 调试暂停时禁用控制器 wall-clock timeout |
| `EDGE_SANDBOX_CHILD_STDERR=1` | 转发 child process Inspector 和诊断输出 |

然后打开 `edge://inspect/#devices` 或 `chrome://inspect/#devices`，配置 `localhost:9230`，选择 Node target 并点击 inspect。

调试完毕后必须清除变量：

```powershell
Remove-Item Env:EDGE_SANDBOX_CHILD_INSPECT_BRK -ErrorAction SilentlyContinue
Remove-Item Env:EDGE_SANDBOX_DISABLE_TIMEOUT -ErrorAction SilentlyContinue
Remove-Item Env:EDGE_SANDBOX_CHILD_STDERR -ErrorAction SilentlyContinue
```

不要在正常运行不受信任 bundle 时设置 `EDGE_SANDBOX_DISABLE_TIMEOUT=1`。

## 17. 测试和审计

### 17.1 四档 Node 回归

同一套测试在四个支持的 Node 版本上跑：

```bash
npm run test:matrix        # 等价于逐档 node --experimental-vm-modules --test
```

`npm test` 与矩阵用的是**同一条命令**（`--test` 不带参数，自动发现 `tests/`）。
目录形式与 glob 形式在 Node 18/20 与 22+ 之间不兼容，所以两处都用无参数模式。

Node 18 生成的 module bundle 已在 Node 24 上验证。版本元数据不匹配时，加载器会忽略
`cachedData` 并从源码加载，而不是使用错误 V8 版本的字节码。

**Node 18/20 有一处宿主限制**：Window 全局的枚举顺序做不到与真实 Edge 一致
（V8 < 12 把可枚举键排在不可枚举键之前）。指纹敏感场景请用 Node 22+，
详见 README「环境要求」与 `npm run capabilities` 里的 `vm.global-property-order`。

### 17.2 单独跑某一类

```bash
node --experimental-vm-modules --test tests/fingerprint-calibration-test.js
node --experimental-vm-modules --test tests/window-surface-order-test.js
node --experimental-vm-modules --test tests/baseline-isolation-test.js
```

手动运行 `node --test` 时必须自己加 `--experimental-vm-modules`；
通过 `npm test` / `npm run test:matrix` 时 flag 由 package script 提供。

### 17.3 审计与基线

```bash
npm run audit:state          # 模块级可变状态：哪些状态还没按 Realm 作用域隔离
npm run check:surface-order   # Window 全局顺序表 vs 采集 fixture
npm run check:bundle          # module bundle 是否属于本机（键是绝对 file:// URL）
npm run capabilities          # 宿主能力三态报告（available / broken / unavailable）
npm run baseline              # 重新生成 bootstrap 顺序 / surface / observability 基线
```

与真实 Edge 的对等性检查在测试里，不在单独的审计脚本里：`edge-surface-parity`、
`edge-member-parity`、`window-surface-order`、`edge-behavior-parity`。差异必须
**登记**（`KNOWN_MISSING` / `KNOWN_BEHAVIOR_DIFFERENCES` / `UNPROBED_KNOWN_GAPS`
或顺序表里的 `pending`），数量上限只允许下调。

### 17.4 性能基准

```bash
npm run benchmark
```

报冷启动、热复用、Realm 创建销毁与常驻内存。上界断言取多次采样的**最小值**——
竞争只会让采样变大，最小值受污染最少。

## 18. 常见问题

### 18.1 `vm.SourceTextModule is not a constructor` 或模块 API 错误

先确认 Node 版本与 VM Modules flag：

```powershell
node --version
node --experimental-vm-modules --test tests/node-compat-test.js
```

Node 必须是 `18.18.0` 或更新版本。通过 `npm test`、`npm run test:matrix` 或 `npm run build:bundle` 时 flag 已由 package script 提供；手动运行 `node --test` 或 bundle 工具时必须自己加上 `--experimental-vm-modules`。

不要用早期 Node 的 `moduleRequests`、`linkRequests()` 或 `hasTopLevelAwait()` API 可用性作为版本要求。加载器会根据当前 VM API 选择异步或批量链接路径。

### 18.2 `fingerprint userAgent must describe Chrome ...`

检查 `browserMajorVersion` 和 UA 是否一致：

```js
fingerprint: {
  browserMajorVersion: 151,
  navigator: {
    userAgent: "Mozilla/5.0 Chrome/151.0.0.0 Safari/537.36",
  },
}
```

UA 可以带 `Edg/<major>`（Edge profile 本身就带），但一旦出现，其主版本必须与
`Chrome/<major>` 一致；不带 `Edg/` 按 Chrome 处理。

### 18.3 `fetch()` 返回 `TypeError`

逐项检查：

1. replay 中是否存在该请求；
2. HTTP method 是否一致；
3. URL 是否使用同一协议、主机、端口、路径和 query；
4. 相对 URL 是否根据正确的 `page.url` 解析；
5. 是否误以为 sandbox 会自动联网。

### 18.4 返回结果是 `{ type: "other" }`

复杂值不能直接跨 IPC 返回。在沙箱内使用 `JSON.stringify()`、数组转换或 Base64 编码。

### 18.5 Worker 无法加载

确认 Worker URL 是：

- replay 中的绝对 URL；
- 当前沙箱创建的 Blob URL；或
- 受支持的 `data:` URL。

未知、已撤销或来自其他沙箱实例的 Blob URL 会失败。

### 18.6 `getUserMedia()` 返回 `NotFoundError`

检查：

- `fingerprint.capabilities.media.captureEnabled === true`；
- `devices` 中存在对应的 `audioinput` 或 `videoinput`；
- 调用约束包含 `audio: true` 或 `video: true`。

### 18.7 Sensor 返回 `NotReadableError`

对应传感器未提供确定性 profile，或显式配置为 `null`。为它提供 `x/y/z/frequency` 或 orientation quaternion。

### 18.8 baseline 报出 surface 差异

`npm run baseline` 或 `baseline-full-surface-test` 报差异时，**不要直接改期望值**。
先确认差异是有意的：

1. 采集基准版本与 profile 一致——用 Edge 152 的 fixture 去比 150 的 profile，会把
   版本门控的成员误报成缺失（这个坑踩过两次）；
2. 是否只在某个 Node 档出现——`Iterator` 需要 Node 22+ 之类的宿主缺口另有登记表
   （`src/infra/baseline/known-differences.js`）；
3. 是不是自己刚改的实现带来的，且新值有真实浏览器实测支撑。

确认是预期变更后再 `--write`，并且**四档都要重录**（fixture 按 Node major 分档）。

### 18.9 运行很慢或超时

先检查：

- `timeoutMs` 是否过小；
- `maxHeapBytes` 是否不足；
- HTML、source 或 replay body 是否过大；
- 是否在同一个 Worker Thread 中无限创建完整 Window Realm；
- 是否误启用了 Inspector 并停在 `--inspect-brk`。

不应通过永久禁用 timeout 来解决生产运行问题。

## 19. 能力边界

### 19.1 可以依赖的能力

- Node V8 中的浏览器兼容全局对象；
- DOM、Web IDL brand、事件、Storage、Cookie、Fetch/XHR replay；
- iframe、DedicatedWorker、SharedWorker、ServiceWorker 和 Worklet 的兼容 Realm；
- 可配置 Navigator、UA-CH、Screen、WebGL/WebGPU 和设备能力 profile；
- 可配置 Date、Performance、timer 和 animation frame 时序；
- 受限、可审计的 API Trace 和网络请求 capture；
- 默认 child-process 超时终止与干净重启。

### 19.2 不应宣称的能力

以下行为需要真实 Chromium/Blink、V8 私有 patch、浏览器进程或系统网络栈，当前实现不伪造：

- `document.all` 的原生 `[[IsHTMLDDA]]`；
- 完整原生 `WindowProxy` exotic 行为；
- 真正的 Edge 私有 V8 intrinsic；
- V8 JIT、GC、rendering 和 compositor timing 等 engine-only 行为；
- 浏览器进程/渲染进程/网络进程隔离；
- TLS、ALPN、HTTP/2、HTTP/3、代理和 ClientHello 指纹；
- 真实 GPU、字体、摄像头、麦克风、传感器和外设；
- 系统级 ServiceWorker 网络拦截。

详细限制见 NV8 仓库文档：

- `docs/edge-parity.md` —— 三层对齐现状与方法
- `docs/security-boundaries.md` —— 组件信任边界与安全模型
- `docs/node-compatibility.md` —— Node 18–24 兼容矩阵与宿主缺口
- `README.md` —— 环境要求与能力边界

## 发布前检查清单

- [ ] 使用 Node `18.18.0` 或更新版本（指纹敏感场景用 22+），并在直接 Node 命令中提供 `--experimental-vm-modules`；
- [ ] 默认不受信任代码使用 `child-process`；
- [ ] 所有外部脚本、Worker 和接口数据都有明确 replay；
- [ ] 没有把 sandbox `fetch()` 当作真实 HTTP；
- [ ] 复杂返回值已在沙箱内序列化；
- [ ] profile 中 UA、browser major version、语言、屏幕和 timing 相互一致；
- [ ] 没有修改冻结的 `edge150Fingerprint`；
- [ ] 使用 `try/finally` 调用 `sandbox.close()`；
- [ ] 生产运行没有设置 `EDGE_SANDBOX_DISABLE_TIMEOUT`；
- [ ] `npm run test:matrix` 在四档 Node 全绿；
- [ ] `npm test` 与 `npm run audit:state` 已通过；
- [ ] 明确记录了本地兼容层与真实 Chromium/Edge 的差异。
