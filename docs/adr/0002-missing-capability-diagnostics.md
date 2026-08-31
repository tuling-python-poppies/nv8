# ADR-0002：缺失能力诊断取代覆盖率作为切换门槛

- 状态：已接受（实施中经实测修订，见「修订记录」）
- 日期：2026-01
- 依赖：ADR-0001

## 背景

ADR-0001 决定 plugin 模式不追平 legacy 的 surface 覆盖。这使「按需组装」
成为正式产品形态，而按需组装的前提是**用户能知道自己少装了什么**。

当前实测（`minimalPreset`，4 个插件）：

```js
realm.evaluate('typeof document')        // 'undefined'
realm.evaluate('document.querySelector') // ReferenceError: document is not defined
```

这个错误无法回答三个关键问题：

1. 缺的是什么能力？
2. 该加载哪个插件？
3. 是我配错了，还是 NV8 不支持？

用户只能靠翻源码或试错解决。这让「按需组装」在实践中不可用。

## 决策

把**缺失能力诊断**定为默认模式切换的门槛，取代原来的覆盖率门槛。

### 诊断必须回答的问题

访问未装载的全局时，错误必须包含：

| 字段 | 内容 |
|------|------|
| 缺失的全局名 | 如 `document` |
| 对应能力 | 如 `dom.core` |
| 提供该能力的插件 | 如 `@nv8/plugin-dom-core` |
| 当前已装载的能力 | 便于判断是否配置错误 |

### 不能破坏的语义

**特性探测必须仍然可用。** 大量目标脚本用 `typeof X === 'undefined'` 或
`'X' in globalThis` 做能力探测。如果诊断机制让这些探测抛错，会改变脚本行为，
比裸 `ReferenceError` 更糟。

因此：

- `typeof X` 必须返回 `'undefined'`，不抛错
- `'X' in globalThis` 必须返回 `false`，不抛错
- 只有**实际取值**（`X` / `globalThis.X`）才产生诊断

这个约束决定了实现方式不能是简单的 Proxy 全拦截。

**不能引入可被目标脚本探测的痕迹。** 诊断机制本身不应让沙箱变得可识别——
否则反检测场景下会暴露 NV8。已知取舍见「后果」。

## 实现方向

在 Realm 全局上为「已知但未装载」的名字安装 getter，取值时抛出结构化错误。

需要一张「全局名 → 能力 → 插件」的映射表。这张表从插件 manifest 反向生成：
每个插件声明它 `reserveGlobalSurface()` 的名字，构建时汇总。

未知名字（既不在映射表也未装载）仍然是原生 `ReferenceError`——这既符合
浏览器行为，也避免为不存在的 API 编造建议。

## 后果

### 正面

- 按需组装可用：配错能立刻知道
- 缺失能力可被程序化收集，便于自动推荐 Profile

### 负面与取舍

**getter 可被检测。** `Object.getOwnPropertyDescriptor(globalThis, 'document')`
会看到一个 getter 而非 `undefined`（真实浏览器里未定义的全局根本没有描述符）。

取舍：这个差异只在「目标脚本主动枚举未定义全局的描述符」时可见，属于极少数
反检测场景。且诊断 getter 只安装在**未装载**的名字上——正常配置下需要的
能力都已装载，不存在 getter。

需要完全无痕的场景可以关闭诊断（配置项），退回裸 `ReferenceError`。

**映射表需要维护。** 插件新增全局时若忘记登记，诊断会漏报。用测试从插件
manifest 反查，防止漂移。

## 验收标准

1. 未装载能力取值时给出含能力名和插件名的结构化错误
2. `typeof` 和 `in` 探测行为不变
3. 未知全局仍是原生 `ReferenceError`
4. 诊断可关闭
5. 映射表与插件 manifest 一致性有测试保证


---

## 修订记录

实施时撞到三个实测障碍，其中一个推翻了原方案。

### 修订一：默认不修改全局

原方案「为未装载全局安装抛错 getter」在实施中遇到两个障碍。

**障碍 A：宿主侧 `defineProperty` 在 vm 里不生效。**

`vm.createContext(sandbox)` 之后，对宿主 `sandbox` 对象新增的访问器不会同步
进 contextified global。实测：

```
裸标识符 probeA        → 原生 ReferenceError（getter 未被调用）
globalThis.probeA      → undefined（getter 未被调用）
'probeA' in globalThis → true（in 检查穿透到宿主对象）
```

必须在 vm **内部**执行 `defineProperty`。

**障碍 B：`typeof` 语义与取值抛错不可兼得。**

改到 vm 内部装 getter 后，`typeof X` 也抛错。这是语言规范决定的：`typeof`
只对**完全未声明**的标识符返回 `'undefined'`，对「已声明但取值抛错」的绑定
会传播错误。

于是本 ADR 原本的两条要求在同一属性上冲突：

- 「`typeof X` 返回 `'undefined'` 不抛错」
- 「取值抛结构化错误」

大量目标脚本用 `typeof X === 'undefined'` 做特性探测，破坏它比缺少诊断更
危险。**因此默认方案改为不修改全局**，诊断通过查询 API 提供：

```js
await realm.capabilityExplainer.diagnose(error)   // 从 ReferenceError 反查
await realm.capabilityExplainer.explain('document')
await realm.capabilityExplainer.suggest([...])
```

getter 方案降级为可选的 `capabilityDiagnostics: 'strict'`，文档标明它破坏
`typeof` 探测，仅适合调试期。

### 修订二：explainer 必须惰性

最初把诊断构建写成 Realm 创建流程里的 `await`。结果 async 页面脚本的执行
时序被改变——`await import()` 加上读 28 个插件文件的 IO 在流程末尾插入了
显著延迟，async 脚本在这期间就跑完了，状态仍是 `loading` 而非 `interactive`，
`page-script-lifecycle` 测试稳定失败。

诊断是**出错后**才需要的辅助设施，没有理由拖慢每个 Realm 的创建。改为惰性：
首次访问 `capabilityExplainer` 才构建，方法因此是 async。

strict 模式必须在脚本运行前装好 getter，无法惰性化——它是显式开启的调试
模式，那点延迟可以接受。

### 修订三：跨 Realm 对象不能用 instanceof / deepStrictEqual

`diagnose()` 一度总是返回 null。原因是它用 `error instanceof Error` 判类型，
而从 vm context 抛出的错误，其 `Error` 构造函数与宿主不同，跨 Realm
`instanceof` 恒为 false。改为鸭子类型检查 `typeof error.message === 'string'`。

同源问题还有两处：

- `installStrictCapabilityDiagnostics()` 返回的数组来自 vm，需在宿主侧
  `Array.from()` 复制，否则调用方的 `deepStrictEqual` 会因构造函数不同而失败
- strict getter 抛出的错误里 `loadedCapabilities` 是 vm 的 Array，宿主侧
  比较需用 `[...arr]` 或 `deepEqual`

## 修订后的验收标准

1. ✅ 未装载能力可通过查询 API 得到含能力名和插件名的结构化诊断
2. ✅ `typeof` / `in` 探测行为不变（默认模式不修改全局）
3. ✅ 未知全局仍是原生 `ReferenceError`，不编造建议
4. ✅ 诊断可关闭（`capabilityDiagnostics: false`）
5. ✅ 映射表从插件源码静态解析，有测试防漂移
6. ✅ 诊断不影响 Realm 创建时序（惰性构建）
7. ⚠️ strict 模式破坏 `typeof` 探测——已记录为显式取舍，非缺陷
