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
 *
 * ## 为什么还要加 GC 余量
 *
 * 顺序构建 Realm（INIT / setPage 反复重建）会在模块图编译时产生数倍于
 * 存活集的短命对象。余量只留「能引导一个 Realm」时，V8 可能在完成回收前
 * 撞上硬上限并 OOM（worker_threads 下这会被 Node 变成
 * `ERR_WORKER_OUT_OF_MEMORY`，进程内无法结构化拦截）。实测在 512MB 配置
 * 下连续重建 Realm，没有余量时稳定在第三、四轮 OOM；加入 384MB 余量后
 * 连续 6 轮重建稳定通过。逻辑配额仍由配置值独立把关，不受余量影响。
 */

/**
 * V8 老生代下限（MB）。低于此值无法可靠引导一个 Realm。
 *
 * 改这个值必须重新实测，不能凭感觉调。
 */
export const MINIMUM_RUNTIME_HEAP_MB = 128;

/**
 * V8 硬上限的 GC 余量（MB）。
 *
 * 覆盖「顺序重建 Realm 时尚未回收的构建垃圾」。按实测（512MB 配置、
 * resource-stress 连续重建）取值：256MB 仍会在第 5 轮 OOM，384MB 起稳定。
 */
export const RUNTIME_GC_HEADROOM_MB = 384;

/**
 * 算出实际要传给 V8 的老生代上限。
 *
 * @param {number} maxHeapBytes 配置的堆预算
 * @returns {number} MB
 */
export function resolveRuntimeHeapMegabytes(maxHeapBytes) {
  const requested = Math.floor(maxHeapBytes / (1024 * 1024));
  return Math.max(MINIMUM_RUNTIME_HEAP_MB, requested) + RUNTIME_GC_HEADROOM_MB;
}
