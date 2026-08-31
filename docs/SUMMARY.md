# NV8 架构改造总结

**状态：核心架构已完成，2-4周可达内部可用**

---

## 核心成果

### ✅ 已完成（100%）

#### 1. 架构重构
- App/Sandbox/Realm 三层结构
- Plugin SDK 和生命周期钩子
- Profile 工厂和 lock plan
- 后端抽象（child-process / worker-thread）
- 资源限制和诊断系统
- Evidence Bundle 离线重放

#### 2. Realm 类型
- Window (root + iframe)
- Worker (Dedicated)
- SharedWorker
- ServiceWorker
- Worklet

#### 3. 浏览器 API 插件化
- WebIDL Foundation
- Events + DOM Core + Collections
- HTML Elements
- Navigation (Location/History)
- Fetch + XHR + Streams
- Storage + Navigator + Performance
- Crypto + WebSocket + Messaging + Timers

#### 4. 生命周期
- 页面脚本执行（inline/external/defer/async/module）
- 静态模块导入和 replay
- Worker 创建和消息传递
- ServiceWorker 注册/安装/激活/更新/拦截
- iframe 导航和生命周期
- 资源清理钩子

---

## 测试状态

```bash
npm test
```

**结果：88/88 passed ✅**

覆盖范围：
- Evidence Bundle 加载和验证
- Plugin 依赖解析和安装
- Profile lock plan
- Realm 创建和销毁
- Worker/SharedWorker/ServiceWorker 完整生命周期
- iframe 导航和消息传递
- 页面脚本执行（parser-blocking/defer/async/module）
- document.write/open/close
- 资源清理和并发压力
- 超时和限制
- Baseline baseline 和隔离

---

## 待完成工作

### 🔴 高优先级（阻塞 plugin 模式默认切换）

#### 1. 状态清理 (1-2周)
**问题：** 模块级可变状态会在多 Realm 场景下串状态

**关键文件：**
- `src/webidl/native-function.js` (crossRealmRegistry, registeredNativeFunctions)
- Navigation/DOM/timers/observers 等模块的全局注册表

**任务：**
- [ ] 将模块级状态迁移到 `StateRegistry`
- [ ] 确保每个 Realm 有独立状态副本
- [ ] 添加多 Realm 并发状态隔离测试

#### 2. 模块加载 (1周)
**问题：** 动态 import() 和模块缓存语义未定

**任务：**
- [ ] 确定动态 import() 策略（offline replay 或结构化拒绝）
- [ ] 确定模块缓存作用域（per-Realm / per-Sandbox / shared）
- [ ] 实现模块取消和销毁
- [ ] 添加 Worker/SW 并发 import() 限制

#### 3. Baseline 批准 (1周)
**问题：** legacy vs plugin 基线差异未正式批准

**任务：**
- [ ] 审查 fixtures/baseline/legacy-surface.json
- [ ] 审查 fixtures/baseline/plugin-surface.json
- [ ] 批准预期差异列表
- [ ] 固化回归检测流程

---

### 🟡 中优先级（按实际需求）

#### 4. 完整页面生命周期 (1-2周)
- [ ] 根 Window 导航和文档替换（已实现基础版）
- [ ] iframe beforeunload 取消
- [ ] DOMContentLoaded 完整时序

#### 5. 按需浏览器 API（视目标站点而定）
- [ ] Canvas/WebGL
- [ ] Blob/File/FileReader
- [ ] IndexedDB
- [ ] CSSOM

#### 6. Protocol 和 Collector（视实际需求而定）
- [ ] Protocol 工件接口（sign/token/challenge）
- [ ] Collector 真实网络

---

### ⚪ 不需要（内部工具）

- ❌ 多 Node 版本兼容（锁定 Node 24）
- ❌ 公开文档和示例
- ❌ npm 发布流程
- ❌ SemVer 和向后兼容承诺
- ❌ 性能预算和 benchmark
- ❌ 跨版本迁移指南

---

## 时间估算

| 里程碑 | 时间 | 内容 |
|--------|------|------|
| **最小可用版本** | 2-3周 | 状态清理 + 模块加载 + Baseline 批准 |
| **完整页面生命周期** | +1-2周 | 根导航 + document.write/open/close（已基本完成） |
| **按需 API 补充** | 按需 | Canvas(2-3天) / Blob(1-2天) / IndexedDB(3-5天) |

---

## 架构文档

### 核心文档
- [架构改造计划](./架构改造计划.md) - 完整架构设计
- [发布策略更新](./架构改造计划-发布策略更新.md) - 内部工具版调整
- [当前进度总结](./当前进度总结.md) - 详细进度和任务列表

### 技术参考
- [Baseline Baseline](../src/baseline/baseline.js) - 行为基线检测
- [Plugin SDK](../src/core/plugin-sdk/) - 插件开发接口
- [Evidence Schema](../src/evidence/schema.js) - 证据包格式
- [Page Script Runner](../src/core/page-script-runner.js) - 页面脚本执行

---

## 下一步行动

### 本周（立即开始）
1. **状态清理：** 迁移 `webidl/native-function.js` 模块级状态到 StateRegistry
2. **模块加载：** 确定动态 import() 策略并实现

### 下周
3. **Baseline 批准：** 审查并批准 legacy/plugin 基线差异

### 后续按需
4. **页面生命周期：** 根据实际目标需求补充（基础版已完成）
5. **浏览器 API：** 根据实际目标需求补充

---

## 总结

| 指标 | 状态 |
|------|------|
| 核心架构 | ✅ 100% |
| Realm 支持 | ✅ 100% |
| 生命周期 | ✅ 95% |
| 测试覆盖 | ✅ 88/88 |
| **预计可用** | **2-4周** |

**关键阻塞：** 状态清理、模块加载、Baseline 批准

**不需要：** 多版本兼容、公开发布、完整文档

**2025-01 更新**
