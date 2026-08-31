# Phase 5: Evidence Bundle Loader 总结

## 已完成

公共运行时现在支持：

```js
const sandbox = await createSandbox('https://example.test/', {
  evidence: {
    bundlePath: '/path/to/evidence-bundle',
    trustedScriptPolicy: 'registered-only',
  },
});
```

Bundle 会在子进程或 Worker Runtime 初始化时校验并加载。

- `src/evidence/schema.js`: Bundle schema、角色、媒体类型、大小和路径限制
- `src/evidence/errors.js`: 结构化 Evidence 错误类型
- `src/evidence/loader.js`: Manifest、文件、符号链接、大小和 SHA-256 校验
- `src/evidence/script-injector.js`: 异步脚本注入和 lazy script loading 时序
- `src/evidence/network-replay.js`: 确定性请求匹配和 replay 统计
- `src/evidence/index.js`: Evidence API 统一导出
- `src/core/plugin-registry.js`: legacy 插件元数据标准化和能力型依赖解析
- `src/core/sandbox.js`: 阻止 host-global legacy installer 在 Core 生命周期中误安装
- Core Realm activation hooks 第一批：WebIDL、Console、Timers、Encoding、URL、Events、DOMException、Abort、DOM Core、DOM Collections、Storage、Location、History、Streams、Fetch、XHR、Navigator、Performance、Crypto、WebSocket、HTML Elements
- Core Realm 已支持通过 `profile.pageHtml` 初始化页面 DOM；WebIDL registry 和部分 host constructor 的完全隔离仍需继续处理
- 统一 `iframe` 文件命名，移除历史分词路径变体；公开符号仍使用 `HTMLIFrameElement`
- `definePlugin()` 现在保留 `activate/reset/dispose` 生命周期钩子

## Bug 修复验证

### DOM parser XML 声明

`parseFragment()` 现在显式跳过 `<?...?>` 处理指令，包含 XML 声明和自定义处理指令；未闭合处理指令会终止解析，不会循环。

### Harness 预加载时序

Script Injector 默认使用任务队列异步执行脚本。即使脚本已经加载，注册回调也会在后续任务中触发，不会同步执行。AWSC.use 类似场景已通过回归测试。

### insertBefore 注入追踪

`appendChild` 和 `insertBefore` 都通过 DOM trace 路径记录，动态注入脚本节点不会因为只覆盖 appendChild 而丢失观测。

## 测试结果

```text
DOM parser tests:       3/3 passed
Evidence/Replay tests:  9/9 passed
Script timing tests:    8/8 passed
Public runtime integration: 2/2 passed
Total:                 22/22 passed
```

运行命令：

```bash
npm test
```

## Gate 1 基础设施进展

已新增 Host capability probe、可序列化 Plugin lock plan、稳定拓扑排序、依赖版本校验、基础 Profile 工厂、Realm capacity、evaluate/output timeout、frame queue/value depth 限制、有上限 lifecycle recorder、统一 diagnostics limit code、App 级 lifecycle/diagnostics 聚合、payload 超限错误响应、timeout 后 transport cleanup，以及 Worker/SharedWorker/ServiceWorker/iframe reset cleanup、SharedWorker multi-owner、重复 reset、并发 reset、pending creation generation guard，以及 WindowClient `matchAll`/operation/navigation（same-origin filtering、iframe Realm/Document replacement with stable client id + ServiceWorker fetch interception + old Document pagehide/unload + invalid src error preservation）/iframe removal/controllerchange update/unregister（每 client 单次 transition），以及 page script classic/module/currentScript/load-error 基础矩阵。`createNv8()` 现在在 Sandbox 创建前生成并校验 plan，记录 Node/V8/宿主 feature、Profile digest、插件版本、依赖、能力和安装顺序；`runtimeMode` 只接受 `legacy`/`plugin`，默认仍为 `legacy`，尚未宣称 plugin 模式已覆盖全部能力。

## Baseline 初始基线

已新增 `fixtures/baseline/basic.json`、`tests/baseline-baseline-test.js` 和 `tests/baseline-isolation-test.js`，统一捕获 legacy `createSandbox()` 与 Core `createNv8()` 的页面 surface、DOM mutation、offline replay、Worker 消息、reset、Realm storage 隔离、句柄回收和可序列化诊断。当前比较结果会保留已审批的初始差异，避免将未迁移能力或 Core document replacement 语义误判为测试工具错误。Core iframe child Realm factory 已接线，并覆盖 same-origin `contentWindow`/`contentDocument`、跨源 facade、`srcdoc`、Window/postMessage（child source/targetOrigin）、`src` replacement、Navigator/storage scope 和移除清理；iframe 行为已进入 Baseline basic fixture；ServiceWorker child Realm 现在会按匹配 scope 获取 Sandbox active handle 的本地 controller wrapper；已增加 Sandbox WindowClient registry、按 scope 的 `clients.matchAll()` snapshots 和 child Realm 回收；仍需补多 client 的 controllerchange、registration update propagation 和完整 clients identity。

## 未完成项

- 动态 script 节点已通过 Realm 内 MutationObserver 接入 `appendChild`/`insertBefore` 路径，Public Runtime 和 Core Plugin Runtime 均有端到端覆盖；Core 页面生命周期已补齐基础 `readyState`、`document.currentScript`、`DOMContentLoaded` 和 `load` 顺序；DOM Collections 的 NodeList、HTMLCollection、NamedNodeMap、DOMTokenList 也已迁移到 Realm activation；仍需补充更完整的 DOM conformance 覆盖
- Core 中仍有一批 legacy 插件只参与依赖/能力解析；Events、DOMException、Abort、DOM Core、DOM Collections、Storage、Location、History、Streams、Fetch、XHR、Navigator、Performance、Crypto、WebSocket、HTML Elements 以及 Messaging、Worker、Worklet 已通过 RealmModuleLoader 在 Realm 内执行安装器；Dedicated Worker/SharedWorker 脚本仅使用离线 replay 或 data URL，支持嵌套 Worker 和 module Worker 静态离线 imports；Worker replay 维护 Sandbox 级 repeat/sequence 游标，并通过 `ERR_NV8_WORKER_REPLAY_MISS` 暴露 missing、exhausted、sequence-mismatch 诊断；Worker 内 Fetch/XHR 复用 replay 并通过 network recorder 标记 worker realm 归属；ServiceWorker 支持 register、install/activate、skipWaiting、clients.claim/matchAll、controllerchange、controller、postMessage 和 FetchEvent.respondWith 离线拦截；页面 Fetch 与异步 XHR 均可被 active ServiceWorker 响应拦截，带 `navigation: true` 的新 Core document 创建也会按最长 scope 先经过 ServiceWorker，未拦截时回退普通 replay/pageHtml；registration.update() 支持 installing/waiting/active 替换、同 registration 并发更新合并、入口脚本与静态 module import 依赖图版本指纹 no-op 检测（支持循环/重复 import），Dedicated Worker module 复用相同图指纹、updateViaCache:none 强制更新、skipWaiting 激活和失败回滚；scope 匹配包含路径边界校验并支持重叠 registration 的最长 scope 选择，Worker module imports 强制同源，active Worker handle 未就绪时消息排队，controller message source 保持当前 ServiceWorker 对象；Worklet 使用独立 Realm，Worker、SharedWorker 和 ServiceWorker 子 Realm 在插件 dispose/Sandbox 销毁时统一清理；WebSocket 保持离线失败边界，parser-blocking、async/defer/module script、Worker 诊断、设备网络路径及更完整的 replay 诊断仍需继续迁移
- Protocol、Collector 和 Profile lock 尚未实现
- 现有旧 bootstrap 仍是默认运行路径
