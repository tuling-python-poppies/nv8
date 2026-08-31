# Evidence 契约与解耦

Core 不依赖任何 Evidence Bundle 磁盘格式。它只依赖一个抽象接口：`EvidenceSource`。

## 为什么

原先 `src/core/sandbox.js` 直接 import 了 `TRUST_POLICIES`，并调用
`bundle.getEntrypoints()`、`bundle.getScripts()`、`bundle.readFile()`。
这带来三个问题：

- Bundle manifest schema 一变，Core 就得改
- Core 的测试必须准备真实目录、真实哈希才能跑证据相关路径
- Evidence loader 无法拆成独立包，因为 Core 反向依赖它

现在依赖方向是单向的：

```
core/evidence-contract.js     ← 零依赖，纯接口定义
        ↑
evidence/evidence-source.js   ← 适配器，把具体 Bundle 包装成契约
        ↑
evidence/loader.js            ← 具体格式：manifest、哈希、路径校验
```

Core 只 import 上面第一层。这一点由测试
`tests/evidence-contract-test.js` 用源码扫描强制，不靠约定。

## EvidenceSource 接口

八个方法，资源用不透明 `id` 标识：

```js
{
  has(id): boolean
  readText(id): Promise<string>
  readBinary(id): Promise<Buffer>
  listEntryScripts(): Promise<string[]>
  listScripts(): Promise<Array<{ id, mediaType, bytes, role }>>
  listPages(): Promise<Array<{ id, ... }>>
  getNetworkReplayFixture(): Promise<object|null>
  describe(): object
}
```

基于文件的实现把 `id` 当相对路径，但 Core 不做这个假设——它只把 `id`
原样传回给 source。这样远程存储、打包容器、内存组装都能接入。

契约校验用 duck typing 而非 `instanceof`，因为实现可能来自独立包或测试替身：

```js
import { assertEvidenceSource, isEvidenceSource } from 'nv8/core';

assertEvidenceSource(source);   // 缺方法时列出全部缺失项
isEvidenceSource(source);       // 不抛错版本
```

## 两种实现

### 包装真实 Bundle

```js
import { loadEvidenceBundle, createEvidenceSource } from './evidence/index.js';

const bundle = await loadEvidenceBundle('./evidence/target-site');
const source = createEvidenceSource(bundle);
```

`createEvidenceSource` 是唯一知道 `file.path`、`file.role`、
`manifest.entrypoints` 这些字段的地方。

它保留一个 `underlyingBundle` 逃生舱，供需要 manifest 细节的证据层工具使用。
Core 不使用它——用了就等于重新引入格式耦合。

### 内存构造

测试和程序化组装用这个，不需要磁盘：

```js
import { createInMemoryEvidenceSource } from './evidence/index.js';

const source = createInMemoryEvidenceSource({
  resources: { 'entry.js': 'globalThis.sign = () => "abc";' },
  entryScripts: ['entry.js'],
});
```

Core 可以直接用它跑通完整脚本执行路径：

```js
const sandbox = await createSandbox({
  plugins,
  evidenceSource: source,
  evidence: { executeScripts: true, trustedScriptPolicy: 'entrypoints-only' },
});
```

## 受信任脚本策略

策略枚举属于 **Core**，不属于 Bundle schema——"哪些脚本允许在 Realm 里执行"
是运行时信任决策，不是证据格式描述。

| 策略 | 行为 |
|------|------|
| `entrypoints-only`（默认） | 只执行 source 声明的入口脚本 |
| `allowlist` | 只执行 `scriptAllowlist` 中的脚本 |
| `deny-all` | 不执行任何证据脚本 |

`registered-only` 作为历史别名保留，语义等同 `entrypoints-only`。

策略解析统一走 `resolveTrustedScriptIds()`，Core sandbox 和 child runtime-pool
共用同一实现，避免两处判定不一致。

### allowlist 拒绝未声明脚本

```js
await resolveTrustedScriptIds(source, {
  trustedScriptPolicy: 'allowlist',
  scriptAllowlist: ['scripts/not-declared.js'],
});
// → ERR_NV8_EVIDENCE_POLICY_REJECTED
```

宁可失败也不静默跳过：allowlist 里出现 source 没声明的脚本，说明配置与证据
不一致，继续执行是危险的。

## 错误码

| 错误码 | 含义 |
|--------|------|
| `ERR_NV8_EVIDENCE_SOURCE_INVALID` | 对象不满足契约（列出缺失方法） |
| `ERR_NV8_EVIDENCE_RESOURCE_NOT_FOUND` | 资源 id 不存在 |
| `ERR_NV8_EVIDENCE_POLICY_INVALID` | 策略名未知或 allowlist 配置错误 |
| `ERR_NV8_EVIDENCE_POLICY_REJECTED` | allowlist 引用了未声明脚本 |

契约层用自己的 `EvidenceContractError`，不继承 Evidence 实现层的错误类型，
避免反向依赖。

## ScriptInjector 的归属

`ScriptInjector` 已从 `src/evidence/` 迁到 `src/core/`。它零 import、
与 Bundle 格式无关，本质是"按正确时序注入脚本"的运行时机制，属于 Core。

`src/evidence/index.js` 保留转导出以兼容现有引用。

## 测试

```
tests/evidence-contract-test.js   21 项
```

包含两条结构性断言：

- Core 源码不 import 任何 `evidence/` 路径（除契约自身）
- `evidence-contract.js` 自身零 import

这两条会在有人重新引入耦合时立刻失败。
