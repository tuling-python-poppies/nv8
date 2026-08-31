/**
 * 判断 Realm 全局上某个名字是否**真实可取值**。
 *
 * 为什么不能直接写 `if (!realm.global.document)`：
 *
 * 缺失能力诊断（ADR-0002）会为未装载的已知全局安装抛错的 getter。取值式
 * 探测会触发它，让 Core 自身的构建流程崩在诊断上——诊断是给目标脚本的，
 * 不该干扰 Core。
 *
 * 用 `getOwnPropertyDescriptor` 检查描述符：诊断 getter 只有 `get`
 * 而没有 `value`，真实实现则相反。这样探测不触发 getter。
 *
 * @param {object} realmGlobal
 * @param {string} name
 * @returns {boolean}
 */
export function hasRealmValue(realmGlobal, name) {
  if (realmGlobal === null || typeof realmGlobal !== 'object') return false;

  const descriptor = Object.getOwnPropertyDescriptor(realmGlobal, name);
  if (descriptor === undefined) return false;

  // 数据属性：直接看值
  if ('value' in descriptor) {
    return descriptor.value !== undefined && descriptor.value !== null;
  }

  // 访问器：无法在不调用的前提下确认它是真实实现还是诊断桩，
  // 因此尝试取值并把诊断错误当作「不存在」。
  if (typeof descriptor.get !== 'function') return false;
  try {
    const value = descriptor.get.call(realmGlobal);
    return value !== undefined && value !== null;
  } catch (error) {
    if (error?.code === 'ERR_NV8_CAPABILITY_NOT_LOADED') return false;
    throw error;
  }
}

/**
 * 安全读取 Realm 全局上的值，不存在或仅有诊断桩时返回 `undefined`。
 *
 * @param {object} realmGlobal
 * @param {string} name
 * @returns {unknown}
 */
export function readRealmValue(realmGlobal, name) {
  return hasRealmValue(realmGlobal, name) ? realmGlobal[name] : undefined;
}
