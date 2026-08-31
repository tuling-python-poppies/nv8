# NV8 重构状态看板

## 当前阶段：Phase 5 基础实现完成，Phase 3 插件迁移进行中

### 总体进度

```
Phase 0: 行为基线             🟡 初始 fixture 与双入口比较已建立
Phase 1: Core 边界           🟡 Host probe/lock plan/limits/diagnostics 基础已建立，App 聚合已接入  
Phase 2: Plugin SDK & 注册器  🟡 基础完成，lock plan/conformance 继续完善
Phase 3: 现有实现适配         🟡 进行中（Events/DOM/Storage/Navigation/Network/Navigator/Performance/Crypto/WebSocket 首批 Realm activate hooks）
Phase 4: Profile             🟡 基础 Profile 工厂和 digest 已建立
Phase 5: Evidence Loader     ✅ 基础实现完成
Phase 6: Protocol/Collector  ⬜ 待开始
Phase 7: 发布                ⬜ 待开始
```

---

## Phase 2 完成清单 ✅

### 核心组件 (7/7)

- ✅ `define-plugin.js` - 插件定义 API
- ✅ `capability-registry.js` - 能力注册表
- ✅ `global-surface-registry.js` - 全局表面注册表
- ✅ `state-registry.js` - 状态注册表
- ✅ `lifecycle-manager.js` - 生命周期管理器
- ✅ `plugin-installer.js` - 插件安装器
- ✅ `errors.js` - 诊断和错误系统

### 测试 (4/4)

- ✅ 基础应用和 Sandbox 创建
- ✅ 依赖解析测试
- ✅ 表面冲突检测
- ✅ 缺失依赖检测

### 关键修复

- ✅ StateRegistry 清理策略 bug（保留命名空间注册）
- ✅ 所有测试通过，无警告

---

## Phase 3 待办清单 🔄

### 1. Bootstrap 包装 (优先级：高)

- ✅ 分析 `bootstrap-root.js`、`bootstrap-worker.js`、`bootstrap-worklet.js` 的安装顺序
- [ ] 创建适配器包装现有安装逻辑
- ✅ 保存安装顺序快照（用于验证）到 `fixtures/baseline/bootstrap-order.json`
- [ ] 实现 feature flag 切换机制
- ✅ Host capability probe、runtimeMode 校验、Plugin lock plan、Realm capacity、evaluate/output timeout、bounded diagnostics、lifecycle recorder 和 timeout 后 transport cleanup 已加入运行时
- ✅ Frame queue/value depth 已配置化并跨 child-process/worker-thread 覆盖；Worker/SharedWorker/ServiceWorker/iframe reset cleanup、SharedWorker multi-owner、重复 reset 和并发 pending creation 基础矩阵已通过，长时句柄/内存泄漏检测仍待完成
- ✅ ServiceWorker WindowClient 基础语义已覆盖：`matchAll()` type/windowType/includeUncontrolled、same-origin filtering、focus/navigate/postMessage source、iframe remove client unregister、iframe Realm/Document replacement with stable client id、iframe navigation ServiceWorker fetch interception、旧 Document pagehide/unload、invalid src error preservation、root/iframe controllerchange update/unregister broadcast（每 client 单次 transition）

### 2. 首批内置插件 (优先级：高)

#### 基础层
- [ ] `webidl-foundation` - Web IDL 基础
- [ ] `events` - Event、EventTarget、MutationObserver

#### 核心层
- [ ] `dom` - Document、Element、Node
- [ ] `navigation-storage` - Location、History、Storage
- [ ] `fetch-xhr-streams` - Fetch、XHR、Streams

#### 高级层
- [ ] `messaging-workers` - Worker、MessageChannel
- [ ] `rendering-canvas` - Canvas、WebGL
- [ ] `media-device` - Media、Device APIs
- [ ] `fingerprint` - Navigator、Screen、Timing

### 3. 状态迁移 (优先级：中)

- [ ] 识别 `src/api/` 中的模块级状态
- [ ] 识别 `src/install/` 中的全局变量
- [ ] 迁移到 StateRegistry 命名空间
- [ ] 确定正确的 scope（realm/page/origin/sandbox）

### 4. Profile 创建 (优先级：中)

- ✅ 创建基础 `legacy-full` Profile 定义（完整行为 parity 仍未完成）
- 🟡 组合当前 full preset；剩余浏览器能力和 parity 仍待迁移
- [ ] 配置浏览器元数据
- ✅ 编写 Profile id、继承、override 和 digest 测试

### 5. 验证和测试 (优先级：高)

- 🟡 Baseline golden fixtures：已建立 basic-page-replay、bootstrap order 和 surface/descriptor fixtures，已扩展 Worker/Realm 隔离/回收、iframe child Realm、Window/postMessage（含 child source 与 targetOrigin）和 src replacement，仍需补 ServiceWorker child-client/control sharing/关闭行为
- 🟡 对比新旧实现的行为：basic Baseline 已建立，完整覆盖仍待完成
- [ ] 记录和审批差异
- 🟡 建立回归测试：当前 98 个 Node 测试及 Plugin/App 测试通过，跨 Node 矩阵仍待建立；child-process/worker-thread 已覆盖 output/payload/frame-queue/value-depth/timeout/close/Worker/SharedWorker/ServiceWorker/iframe/page-script cleanup 和 reset stress 限制

---

## 下一步行动

### 立即开始

1. **扩展 Baseline 基线**
   - 已保存 basic-page-replay 初始 fixture；继续补充行为快照
   - 记录 surface、descriptor、trace
   - 建立测试 fixtures

2. **分析 bootstrap-root.js** (1-2 天)
   - 提取安装顺序
   - 识别依赖关系
   - 记录全局修改

3. **创建第一个插件** (3-5 天)
   - 从 `webidl-foundation` 开始
   - 包装现有实现
   - 编写插件测试

### 近期目标 (2-3 周)

- 完成首批 3-5 个插件
- 建立插件开发模式
- 验证 legacy-full Profile

---

## 风险和阻塞点

### 当前风险

1. **状态迁移复杂度** 🟡
   - `src/api/` 中有大量模块级状态
   - 需要仔细识别作用域和生命周期
   - 缓解：逐个模块迁移，充分测试

2. **行为兼容性** 🟡
   - 必须保持完全向后兼容
   - 任何差异都需要审批
   - 缓解：详细的 golden fixtures 和对比测试

3. **迁移工作量** 🟢
   - 5500+ 行浏览器 API 实现
   - 需要按能力域逐步迁移
   - 缓解：先包装后重构，保持渐进式

### 无阻塞点

✅ 所有 Phase 2 组件已就绪  
✅ 测试框架已建立  
✅ 错误和诊断系统完整  

---

## 资源和文档

### 主要文档

- 📋 `docs/架构改造计划.md` - 完整的架构规划和设计决策
- 📊 `REFACTORING_SUMMARY.md` - Phase 2 完成总结
- 📝 `STATUS.md` - 本文档，实时状态跟踪

### 关键代码

- `src/core/plugin-sdk/` - 插件 SDK
- `src/core/registry/` - 注册表组件
- `src/core/lifecycle/` - 生命周期管理
- `src/core/test/` - 测试套件

### 运行测试

```bash
node src/core/test/basic.test.js
```

当前结果：✅ 4/4 passing

---

## 更新日志

### 2026-01-XX

- ✅ 完成 Phase 2 所有组件
- ✅ 完成 Evidence Bundle、异步脚本注入和 Network Replay 基础实现
- ✅ 完成 WebIDL、Console、Timers、Encoding、URL、Events、Abort、DOM、DOM Collections、Storage、Location、History、Streams、Fetch、XHR、Navigator、Performance、Crypto、WebSocket、HTML 第一批 Realm activation hooks
- ✅ Core 页面生命周期基础语义：readyState、document.currentScript、DOMContentLoaded、load
- ✅ Core Realm-local Messaging、Dedicated Worker、SharedWorker、Worklet、ServiceWorker capability installers；Worker 脚本仅从离线 replay/data URL 加载，支持嵌套 Worker 和 module Worker 静态离线 imports；Worker replay 支持 Sandbox 级 repeat/sequence 使用计数、missing/exhausted/sequence-mismatch 诊断；Worker 内 Fetch/XHR 支持 replay 和 network attribution；ServiceWorker 支持 register、install/activate、skipWaiting、clients.claim/matchAll、controllerchange、postMessage、FetchEvent.respondWith 及 Fetch/XHR 离线拦截；带 `navigation: true` 的新 Core document 创建会先经过 active ServiceWorker scope 拦截，未拦截时回退原 pageHtml；registration.update() 支持 installing/waiting/active 替换、同 registration 并发更新合并、入口脚本与静态 module import 依赖图版本指纹 no-op 检测（支持循环/重复 import），Dedicated Worker module 复用相同图指纹、updateViaCache:none 强制更新、skipWaiting 激活和失败回滚；scope 匹配包含路径边界校验并支持重叠 registration 的最长 scope 选择，Worker module imports 强制同源，active Worker handle 未就绪时消息排队，controller message source 保持当前 ServiceWorker 对象；Worker/SharedWorker/Worklet/ServiceWorker 子 Realm 纳入 Sandbox 销毁清理
- ✅ Core Realm 支持 `profile.pageHtml` 初始 DOM 构造
- ✅ 修复 StateRegistry 清理 bug
- ✅ 全量回归通过
- ✅ Baseline 初始基线契约：`fixtures/baseline/basic.json`；覆盖 legacy/Core 页面 surface、DOM mutation、offline replay、Worker 消息、iframe child Realm、Window/postMessage（child source/targetOrigin）、src replacement、iframe Navigator/storage scope、reset、Realm storage 隔离、句柄回收和显式差异比较；ServiceWorker child controller sharing 已接入 Sandbox active handle wrapper，已增加 Sandbox WindowClient registry 和按 scope 的 clients.matchAll() snapshots；仍需补多 client controllerchange/update propagation 的完整回归
- 📝 更新架构计划文档
- 📊 创建完成总结文档
- 📋 创建状态看板

---

**下次更新**：开始 Phase 3 工作时  
**责任人**：待分配  
**预计完成 Phase 3**：待规划
