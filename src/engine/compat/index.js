/**
 * 宿主兼容层统一导出
 *
 * 这些回退作用于 NV8 宿主代码，用于在 Node 18.18–22 上补齐
 * 内部实现所需的新版 API。沙箱内暴露给目标脚本的 API 由插件负责。
 */

export {
  HAS_NATIVE_ARRAY_BUFFER_TRANSFER,
  HAS_NATIVE_STRUCTURED_CLONE,
  HAS_NATIVE_ASYNC_DISPOSE,
  HAS_NATIVE_ABORT_TIMEOUT,
  transferArrayBuffer,
  isArrayBufferDetached,
  structuredCloneCompat,
  asyncDisposeSymbol,
  disposeSymbol,
  abortSignalTimeout,
  describeHostCompat,
} from './host-compat.js';
