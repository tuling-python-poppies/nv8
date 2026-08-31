/**
 * 运行时进程/线程的堆下限。
 *
 * `limits.maxHeapBytes` 有两个**互不相干**的用途，混在一起会炸：
 *
 * 1. **策略输入** —— 子进程里用 `floor(maxHeapBytes / 单 Realm 估算)` 算出
 *    `heapSafeRealmLimit`，超了返回结构化的 `LIMIT_HEAP_BYTES`。
 * 2. **V8 老生代上限** —— 直接传给 `--max-old-space-size` /
 *    `maxOldGenerationSizeMb`。
 *
 * 问题在于第 2 项有一条硬地板：**引导一个完整 Realm（337 个 install）本身就要
 * 相当的老生代空间**。给得太低，V8 在引导过程中就 OOM 并 `abort()`——
 * 收到的是 SIGABRT，**没有任何结构化错误**，因为 V8 一旦 abort 就没有 JS
 * 能再运行了。进程内无法拦截。
 *
 * ## 实测数据（Node 24，child-process，各 6 次并发）
 *
 * ```
 *  32MB  0/6 成功   全部 SIGABRT
 *  48MB  0/6 成功   全部 SIGABRT
 *  64MB  5/6 成功   ← 悬崖边，这就是"偶发失败"的真身
 *  80MB  6/6 成功
 *  96MB  6/6 成功
 * 128MB  6/6 成功
 * ```
 *
 * 原先的地板是 32MB——**保证崩溃**。取 128MB 是在实测可用的 80MB 上留 1.6 倍
 * 余量：内存压力下的 OOM 时机本身有抖动，贴着可用值取会把"必崩"换成"偶崩"，
 * 而偶崩比必崩更难查。
 *
 * ## 为什么抬高上限不会削弱守卫
 *
 * 两个用途走的是不同路径：`heapSafeRealmLimit` 用**配置值**算，
 * V8 上限用**钳制后的值**。所以 `maxHeapBytes: 64MB` 仍然得到
 * `heapSafeRealmLimit = 1`，仍然会返回 `LIMIT_HEAP_BYTES`——只是子进程
 * 不会在返回它之前先崩掉。
 */

/**
 * V8 老生代下限（MB）。低于此值无法可靠引导一个 Realm。
 *
 * 改这个值必须重新实测，不能凭感觉调。
 */
export const MINIMUM_RUNTIME_HEAP_MB = 128;

/**
 * 算出实际要传给 V8 的老生代上限。
 *
 * @param {number} maxHeapBytes 配置的堆预算
 * @returns {number} MB
 */
export function resolveRuntimeHeapMegabytes(maxHeapBytes) {
  const requested = Math.floor(maxHeapBytes / (1024 * 1024));
  return Math.max(MINIMUM_RUNTIME_HEAP_MB, requested);
}

/**
 * 上限是否被钳制过。
 *
 * 用于诊断：调用方以为自己限了 64MB，实际是 128MB。不说清楚会让
 * 「为什么内存超了预期」变成一个查不出来的问题。
 *
 * @param {number} maxHeapBytes
 * @returns {boolean}
 */
export function isRuntimeHeapClamped(maxHeapBytes) {
  return Math.floor(maxHeapBytes / (1024 * 1024)) < MINIMUM_RUNTIME_HEAP_MB;
}
