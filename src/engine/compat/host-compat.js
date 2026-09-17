/**
 * 宿主能力常量
 *
 * NV8 在 Node 18.18+ 上运行。这里只描述**宿主能力**（诊断与按版本分支用）；
 * 宿主 API 回退在没有调用方时不提供：需要时直接调用原生实现。
 *
 * 注意：这些常量作用于**宿主**代码。沙箱内提供给目标脚本的 API 由插件
 * 负责，不走这里。
 */

/** ArrayBuffer.prototype.transfer 需要 Node 21+ */
export const HAS_NATIVE_ARRAY_BUFFER_TRANSFER =
  typeof ArrayBuffer.prototype.transfer === 'function';

/** structuredClone 需要 Node 17+ */
const HAS_NATIVE_STRUCTURED_CLONE = typeof structuredClone === 'function';

/** Symbol.asyncDispose 需要 Node 20+ */
const HAS_NATIVE_ASYNC_DISPOSE = typeof Symbol.asyncDispose === 'symbol';

/** AbortSignal.timeout 需要 Node 17.3+ */
const HAS_NATIVE_ABORT_TIMEOUT = typeof AbortSignal?.timeout === 'function';

/**
 * vm 的 contextified global 是否用 `PropertyQueryCallback` 回答 `in`。
 *
 * Node 22 之前，`vm` 通过 **getter** 实现全局对象的 `has` 查询，于是在 Realm
 * 里写 `'X' in globalThis` 会**真的调用**那个 getter。实测：
 *
 * | Node | `'X' in globalThis` | getter 被调用次数 |
 * |---|---|---|
 * | 18.20.8 | true | **1** |
 * | 20.20.2 | true | **1** |
 * | 22.22.2 | true | 0 |
 * | 24.11.0 | true | 0 |
 *
 * 影响不止一处：
 *
 * - 特性探测 `'fetch' in window` 会触发 getter 的副作用（trace 会记下一次
 *   从未发生的属性读取）
 * - 抛错型 getter（严格能力诊断）会让 `in` 直接抛，而不是返回 true
 *
 * 这是 V8/Node 的宿主能力，用户态无法修补——只能记录并在依赖它的地方按版本
 * 分支。不要试图用 Proxy 包 globalThis 来抹平：那会引入代理对象自身的可检测面，
 * 比这条差异危险得多。
 */
export const HAS_VM_PROPERTY_QUERY_CALLBACK =
  Number(/^(\d+)/.exec(process.versions.node)?.[1] ?? 0) >= 22;

/**
 * 汇总宿主兼容状态，用于诊断输出。
 * @returns {Readonly<object>}
 */
export function describeHostCompat() {
  return Object.freeze({
    nodeVersion: process.versions.node,
    nativeArrayBufferTransfer: HAS_NATIVE_ARRAY_BUFFER_TRANSFER,
    nativeStructuredClone: HAS_NATIVE_STRUCTURED_CLONE,
    nativeAsyncDispose: HAS_NATIVE_ASYNC_DISPOSE,
    nativeAbortTimeout: HAS_NATIVE_ABORT_TIMEOUT,
  });
}
