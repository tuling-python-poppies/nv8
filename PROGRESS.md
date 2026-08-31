# NV8 重构进度 - 可视化

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NV8 架构改造路线图                                │
└─────────────────────────────────────────────────────────────────────┘

Phase 0: 行为基线建立
└─ [ ] 固化当前公共 API 行为
└─ [ ] 保存 surface snapshot 和 golden fixtures
└─ [ ] 记录 bootstrap 安装顺序
└─ [ ] 建立失败样本和差异清单
Status: ⬜ 待开始


Phase 1: Core 边界抽取
└─ [ ] RuntimeController 和后端契约
└─ [ ] Frame Protocol 和结果归一化
└─ [ ] Realm 生命周期接口
└─ [ ] Legacy adapter 和切换机制
Status: ⬜ 待开始


Phase 2: Plugin SDK 和注册器 ✅
├─ [✅] definePlugin API
├─ [✅] CapabilityRegistry - 能力依赖解析
├─ [✅] GlobalSurfaceRegistry - 表面所有权管理
├─ [✅] StateRegistry - 命名空间状态管理
├─ [✅] LifecycleManager - 生命周期钩子
├─ [✅] PluginInstaller - 依赖图和拓扑排序
├─ [✅] 诊断错误系统 (30+ 错误码)
└─ [✅] 核心测试 (4/4 passing)
Status: ✅ 已完成 ← 当前位置


Phase 3: 现有实现适配
├─ [ ] 包装 bootstrap-root/worker/worklet
├─ [ ] webidl-foundation 插件
├─ [ ] events 插件
├─ [ ] dom 插件
├─ [ ] navigation-storage 插件
├─ [ ] fetch-xhr-streams 插件
├─ [ ] messaging-workers 插件
├─ [ ] rendering-canvas 插件
├─ [ ] 模块级状态迁移到 StateRegistry
└─ [ ] legacy-full Profile 创建和验证
Status: ⬜ 待开始 (下一步)


Phase 4: Browser Profile
└─ [ ] Profile 元数据和组合
└─ [ ] Edge v150/v151 Profile
└─ [ ] 最小 Profile 示例
└─ [ ] Profile lock 和版本兼容矩阵
Status: ⬜ 待开始


Phase 5: Evidence Loader
└─ [ ] Bundle schema 和校验
└─ [ ] 脚本、页面、网络 replay fixture
└─ [ ] 运行时 fixture 加载
└─ [ ] 离线端到端样例
Status: ⬜ 待开始


Phase 6: Protocol & Collector
└─ [ ] 协议工件接口
└─ [ ] Collector 网络边界
└─ [ ] 会话、重试、代理
Status: ⬜ 待开始


Phase 7: 发布
└─ [ ] 文档和迁移指南
└─ [ ] Conformance suite
└─ [ ] Node 兼容矩阵 (18.18 - 24.x)
└─ [ ] 性能基准和预算
Status: ⬜ 待开始


┌─────────────────────────────────────────────────────────────────────┐
│                         整体进度                                     │
├─────────────────────────────────────────────────────────────────────┤
│ Phase 0:  ░░░░░░░░░░░░░░░░░░░░  0%   行为基线                       │
│ Phase 1:  ░░░░░░░░░░░░░░░░░░░░  0%   Core 边界                     │
│ Phase 2:  ████████████████████ 100%  Plugin SDK ✅                  │
│ Phase 3:  ░░░░░░░░░░░░░░░░░░░░  0%   现有实现适配                  │
│ Phase 4:  ░░░░░░░░░░░░░░░░░░░░  0%   Profile                       │
│ Phase 5:  ░░░░░░░░░░░░░░░░░░░░  0%   Evidence                      │
│ Phase 6:  ░░░░░░░░░░░░░░░░░░░░  0%   Protocol                      │
│ Phase 7:  ░░░░░░░░░░░░░░░░░░░░  0%   发布                          │
├─────────────────────────────────────────────────────────────────────┤
│ 总进度:   ██▓░░░░░░░░░░░░░░░░░ 12.5%                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Phase 2 完成详情

### 已实现组件

```
src/core/
├── plugin-sdk/
│   └── define-plugin.js          ✅ 插件定义 API
├── registry/
│   ├── capability-registry.js    ✅ 能力注册表
│   ├── global-surface-registry.js ✅ 全局表面注册表
│   └── state-registry.js         ✅ 状态注册表
├── lifecycle/
│   └── lifecycle-manager.js      ✅ 生命周期管理器
├── diagnostics/
│   └── errors.js                 ✅ 诊断和错误系统
├── plugin-installer.js           ✅ 插件安装器
└── test/
    └── basic.test.js             ✅ 核心测试 (4/4)
```

### 核心能力

✅ **插件定义和验证**
- Manifest 字段校验
- SemVer 版本管理
- 依赖和冲突声明
- Realm 类型约束

✅ **依赖解析**
- 递归展开强依赖
- 可选依赖处理
- 循环依赖检测
- 确定性拓扑排序

✅ **表面管理**
- 全局属性所有权追踪
- 冲突检测和预留
- 按插件清理

✅ **状态管理**
- 命名空间隔离
- 快照和恢复
- 清理策略修复

✅ **生命周期**
- install → activate → reset → snapshot/restore → dispose
- 钩子注册和资源追踪
- 失败时逆序清理

✅ **诊断系统**
- 30+ 结构化错误码
- 完整的上下文信息
- 可序列化诊断对象

### 关键修复

🐛 **StateRegistry.clearPlugin() Bug**
- **问题**: reset 后 restore 失败
- **原因**: clearPlugin 删除了命名空间注册
- **修复**: 只清除状态值，保留命名空间
- **状态**: ✅ 已修复并验证

### 测试状态

```
✅ Core: basic app and sandbox creation
✅ Core: dependency resolution  
✅ Core: surface collision detection
✅ Core: missing dependency detection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASS  4/4 tests
 TIME  ~9.5ms
 WARN  0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 3 计划 (下一步)

### 优先任务

**1. Bootstrap 分析和包装** (估计: 2-3 天)
```
[ ] 分析 bootstrap-root.js 安装顺序
[ ] 创建适配器包装现有逻辑
[ ] 实现 legacy/plugin 切换机制
[ ] 保存安装顺序快照
```

**2. 首个插件实现** (估计: 3-5 天)
```
[ ] webidl-foundation - Web IDL 基础
    - descriptor 工具
    - 原生函数标记
    - toString 行为
[ ] 编写插件测试
[ ] 验证与现有行为一致
```

**3. 状态迁移准备** (估计: 2-3 天)
```
[ ] 扫描 src/api/ 模块级状态
[ ] 识别状态作用域 (realm/page/origin)
[ ] 设计迁移策略
[ ] 创建迁移 checklist
```

### 实施原则

- 🎯 **增量迁移**: 一次一个插件，保持其他稳定
- 🔄 **双轨运行**: 保留旧实现，feature flag 切换
- ✅ **持续验证**: 每个插件都有独立测试
- 📊 **行为对比**: 与 golden fixtures 持续比对

### 风险缓解

🟡 **状态迁移复杂度**
- 策略: 先识别再分类，逐个迁移
- 测试: 每个状态变更都有回归测试

🟡 **行为兼容性**
- 策略: 详细的 golden fixtures
- 审批: 任何差异都记录和审批

🟢 **工作量管理**
- 策略: 先包装后重构，保持渐进
- 里程碑: 每完成一个插件就是一个里程碑

## 资源链接

📋 [架构改造计划.md](./docs/架构改造计划.md) - 完整架构设计  
📊 [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Phase 2 总结  
📝 [STATUS.md](./STATUS.md) - 详细状态跟踪  
🚀 [PROGRESS.md](./PROGRESS.md) - 本文档

---

**最后更新**: 2026-01-XX  
**当前阶段**: Phase 5 基础实现完成 ✅  
**下一里程碑**: Phase 4 Realm/Backend 与 Profile 完善
