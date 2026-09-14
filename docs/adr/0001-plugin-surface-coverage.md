# ADR-0001：plugin 模式不追平 legacy 的 surface 覆盖

- 状态：已接受
- 日期：2026-01
- 决策者：项目所有者

## 背景

Baseline 建立完整 surface 快照后，暴露出两条路径的真实差距：

| 路径 | 全局数 | 原型成员数 | 相对 legacy |
|------|--------|-----------|------------|
| legacy bootstrap | 1234 | 8910 | 100% |
| `fullPreset`（28 插件） | 205 | 2121 | 17% |
| `domPreset`（16 插件） | 149 | 1671 | 12% |

先前的精选 24 全局快照显示两条路径成员数只差 11（520 vs 509），完全掩盖了
这个差距——那 24 个全局恰好都是两条路径都已实现的部分。

缺口对应 `src/migration-targets/` 里登记的 90 个域：WebGL、WebGPU、Media、
CSSOM、SVG、XR、IndexedDB、File System、Speech 等。

## 需要决策的问题

默认运行模式从 `legacy` 切换到 `plugin` 是否以「surface 覆盖追平 legacy」
为前提？

## 考虑过的两个方案

### 方案 A：追平

把 90 个域全部插件化，让 plugin 模式的 surface 与 legacy 一致。

- 工作量是目前所有已完成工作的数倍
- `surface-coverage-gap` 会长期是 blocking 项
- 结果是 plugin 模式变成 legacy 的另一种实现，收益仅是「代码组织更好」

### 方案 B：不追平（采纳）

承认 plugin 模式的目标不是复刻完整浏览器，而是按需组装最小环境。

依据是产品定位本身：

> NV8 的目标不是实现一个完整浏览器，而是实现一个面向 JavaScript 逆向
> 和协议复现的运行时框架。它应当根据目标脚本实际使用的能力，动态组装出
> 最小的、可控的、确定性的浏览器兼容环境。

产品定位同时明确：不在 Core 中实现所有浏览器 API。

按这个定位，205 个全局是**设计意图**而非缺陷。1234 个全局的 legacy 恰恰
违背了「最小化」——它把所有能力无条件装进每个 Realm。

## 决策

采纳方案 B。具体后果：

### 1. `legacy` 与 `plugin` 是两个并存的产品形态，不是新旧替换

| | legacy | plugin |
|--|--------|--------|
| 定位 | 完整兼容入口 | 按需最小组装 |
| surface | 全量（1234 全局） | 按 Profile 决定 |
| 适用 | 目标脚本能力未知、需要最大兼容 | 已知目标脚本所需能力 |
| 默认 | 保持默认 | 显式选择 |

`legacy` 不会被废弃，也不再以「被 plugin 取代」为目标。

### 2. 默认模式切换的门槛改变

原门槛「plugin 覆盖追平 legacy」作废。新门槛是**缺失能力可诊断**：

目标脚本用到未装载的能力时，必须得到可行动的诊断——说明缺什么能力、
建议加载哪个插件——而不是裸 `ReferenceError`。

理由：按需组装的前提是「用户能知道自己少装了什么」。当前实测：

```js
realm.evaluate('document.querySelector("#x")')
// ReferenceError: document is not defined
```

这个错误无法告诉用户需要加载 `@nv8/plugin-dom-core`。这才是真正的阻塞项。

### 3. `surface-coverage-gap` 从 blocking 降级为 tracked

它记录一个事实（两条路径覆盖不同），但这个事实是预期的，不阻塞切换。

保留登记的意义是：如果某天差距意外**扩大**（比如插件被误删），Baseline
仍会报出来。

### 4. `legacy-full` Profile 的定位

计划中的 `legacy-full` Profile 目标不是「让 plugin 追平 legacy」，而是
「为需要全量兼容的场景提供一个 Profile 入口」。它可以直接复用 legacy
bootstrap，而不必逐个插件化。

它采用明确的 `bugfix-and-parity-only` 维护策略：保持 `experimental: true`、
`legacy.compatibilityMode` 和 `bootstrapBehavior: preserve`，兼容关键插件不得
被静默移除；任何 surface、成员顺序、行为或 bootstrap 顺序变更都必须同时通过
对应的 Edge fixture/baseline 门禁。`pluginDrift: fail-closed` 表示插件清单漂移
应在启动或锁计划阶段失败，而不是悄悄把 legacy-full 降级成另一个 Profile。
策略元数据由 `src/config/profiles/legacy-full-policy.js` 校验。

## 不做的事

- 不为了追平覆盖率而批量生成插件包装
- 不把 `migration-targets` 里 90 个域当作待办清单，它们按实际逆向目标需求拉取
- 不宣称 plugin 模式在兼容性上优于 legacy

## 影响的现有产物

- `src/infra/baseline/known-differences.js`：`surface-coverage-gap` severity 改为 `tracked`
- 新增待办：缺失能力诊断（见 ADR-0002）
