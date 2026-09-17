/**
 * 宿主 API 兼容层
 *
 * NV8 在 Node 18.18+ 上运行，但部分内部实现用到了更新版本才有的 API。
 * 这里提供最小可用回退，规则是：
 *
 * - 优先使用原生实现，回退只在缺失时生效
 * - 回退必须保持可观察语义一致；做不到的情况显式抛错，而不是静默降级
 * - 只覆盖 NV8 内部实际用到的调用形态，不做完整 polyfill
 *
 * 注意：这些回退作用于**宿主**代码。沙箱内提供给目标脚本的 API 由插件
 * 负责，不走这里。
 */

/** ArrayBuffer.prototype.transfer 需要 Node 21+ */
export const HAS_NATIVE_ARRAY_BUFFER_TRANSFER =
  typeof ArrayBuffer.prototype.transfer === 'function';

/** structuredClone 需要 Node 17+ */
export const HAS_NATIVE_STRUCTURED_CLONE = typeof structuredClone === 'function';

/** Symbol.asyncDispose 需要 Node 20+ */
export const HAS_NATIVE_ASYNC_DISPOSE = typeof Symbol.asyncDispose === 'symbol';

/** AbortSignal.timeout 需要 Node 17.3+ */
export const HAS_NATIVE_ABORT_TIMEOUT = typeof AbortSignal?.timeout === 'function';

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
 * 分离一个 ArrayBuffer，返回持有原数据的新 buffer。
 *
 * Node 21+ 用原生 `transfer()`。更早版本无法真正分离 ArrayBuffer——
 * 这是 V8 层能力，用户态无法模拟。因此回退**复制**数据并明确告知调用方
 * 源 buffer 未被分离，由调用方决定是否可以接受。
 *
 * @param {ArrayBuffer} buffer
 * @param {number} [newByteLength]
 * @returns {{ buffer: ArrayBuffer, detached: boolean }}
 */
export function transferArrayBuffer(buffer, newByteLength) {
  if (!(buffer instanceof ArrayBuffer)) {
    throw new TypeError('transferArrayBuffer expects an ArrayBuffer');
  }

  if (HAS_NATIVE_ARRAY_BUFFER_TRANSFER) {
    const moved = newByteLength === undefined
      ? buffer.transfer()
      : buffer.transfer(newByteLength);
    return { buffer: moved, detached: true };
  }

  // 无法分离：复制内容，并如实上报 detached: false
  const size = newByteLength ?? buffer.byteLength;
  const copy = new ArrayBuffer(size);
  const copyLength = Math.min(size, buffer.byteLength);
  new Uint8Array(copy).set(new Uint8Array(buffer, 0, copyLength));
  return { buffer: copy, detached: false };
}

/**
 * 判断 buffer 是否已分离。
 *
 * `ArrayBuffer.prototype.detached` 需要 Node 21+；更早版本用
 * byteLength === 0 近似判断（分离后的 buffer byteLength 为 0）。
 *
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
export function isArrayBufferDetached(buffer) {
  if (typeof buffer.detached === 'boolean') return buffer.detached;
  try {
    return buffer.byteLength === 0 && new Uint8Array(buffer).length === 0;
  } catch {
    return true;
  }
}

/**
 * 结构化克隆。缺失原生实现时用 JSON 往返作为**受限**回退。
 *
 * 回退无法保留 Map、Set、Date、RegExp、TypedArray、循环引用。
 * 遇到这些输入时抛错，而不是静默产出错误结果。
 *
 * @param {unknown} value
 * @returns {unknown}
 */
export function structuredCloneCompat(value) {
  if (HAS_NATIVE_STRUCTURED_CLONE) return structuredClone(value);

  const unsupported = findUnsupportedForJsonClone(value, new Set());
  if (unsupported !== null) {
    const error = new TypeError(
      `structuredClone is unavailable on Node ${process.versions.node} and the JSON fallback `
      + `cannot represent ${unsupported}`
    );
    error.code = 'ERR_NV8_STRUCTURED_CLONE_UNAVAILABLE';
    throw error;
  }

  return JSON.parse(JSON.stringify(value));
}

function findUnsupportedForJsonClone(value, seen) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'function') return 'a function';
    if (typeof value === 'symbol') return 'a symbol';
    if (typeof value === 'bigint') return 'a bigint';
    return null;
  }

  if (seen.has(value)) return 'a circular reference';
  seen.add(value);

  if (value instanceof Map) return 'a Map';
  if (value instanceof Set) return 'a Set';
  if (value instanceof Date) return 'a Date';
  if (value instanceof RegExp) return 'a RegExp';
  if (value instanceof Error) return 'an Error';
  if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
    return 'binary data';
  }

  for (const entry of Array.isArray(value) ? value : Object.values(value)) {
    const found = findUnsupportedForJsonClone(entry, seen);
    if (found !== null) return found;
  }

  seen.delete(value);
  return null;
}

/**
 * 返回可用的 async dispose symbol。
 *
 * Node 20 以下缺 `Symbol.asyncDispose`，用固定 key 的注册符号代替，
 * 保证同一进程内多处引用得到同一个 symbol。
 *
 * @returns {symbol}
 */
export function asyncDisposeSymbol() {
  return HAS_NATIVE_ASYNC_DISPOSE
    ? Symbol.asyncDispose
    : Symbol.for('nodejs.asyncDispose');
}

/**
 * 返回可用的 sync dispose symbol。
 * @returns {symbol}
 */
export function disposeSymbol() {
  return typeof Symbol.dispose === 'symbol'
    ? Symbol.dispose
    : Symbol.for('nodejs.dispose');
}

/**
 * 创建一个在指定毫秒后 abort 的 signal。
 *
 * @param {number} milliseconds
 * @returns {AbortSignal}
 */
export function abortSignalTimeout(milliseconds) {
  if (HAS_NATIVE_ABORT_TIMEOUT) return AbortSignal.timeout(milliseconds);

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
  }, milliseconds);
  // 保持 unref：Node 原生 AbortSignal.timeout 的计时器同样不维持事件循环
  // （实测 `node -e "AbortSignal.timeout(5000)"` 立即退出），兼容实现必须
  // 与原生行为一致；abort 只在进程仍存活时才有意义。
  if (typeof timer.unref === 'function') timer.unref();
  return controller.signal;
}

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
