// 把 Window 全局重排成真实 Edge 的枚举顺序。
//
// 顺序与 descriptor 形状是数据，见 `window-surface-order.js`（含为什么它是数据
// 而不是 1.5 万行生成代码的原委）。这里只有三段执行逻辑：
//
//   1. 捕获 —— 按表的顺序取出每一项的 descriptor
//   2. 删除 —— 全部删掉，让 globalThis 的插入序清空
//   3. 重定义 —— 按表的顺序装回，flag 取表里声明的形状
//
// 必须三段分开：JS 对象的字符串键按插入序枚举，只有先全部删完再按目标序装回，
// 才能得到目标顺序。边删边装会让还没删的项留在前面。
//
// 这一切的前提是宿主的 global 真的按插入序枚举。**Node 18/20不是**：V8 10.x /
// 11.x 把可枚举键排在不可枚举键之前，于是 238 个全局跑到 V8 内建前面、
// `window` 落在索引 0。那不是这里能修的（`enumerable` 本身是要复现的契约值），
// 已做成宿主能力探针 `vm.global-property-order`。
//
// **flag 取表而不是取捕获值**是有意的：install 层各自 `defineProperty` 时的
// flag 不一定与真实 Edge 一致，这一步同时兼作规范化。get/set 反过来取捕获值
// ——真实 Edge 有 26 项只有 getter，实测 NV8 零差异，没必要在表里再声明。
//
// `webkitAudioContext` 刻意不在表里：真实 Edge 151+ 已移除这个旧别名
// （对比 fixtures/fingerprint/edge-real.json）。多出一个真实浏览器没有的
// 全局是可识别特征。

import {
  WINDOW_GLOBAL_ORDER,
  WINDOW_GLOBAL_SHAPES,
} from "./window-surface-order.js";

const SHAPE_SET = new Set(Object.values(WINDOW_GLOBAL_SHAPES));

/**
 * 门控是否放行。
 *
 * @param {{since?: number, before?: number, pending?: string}} gate
 * @param {number} browserMajorVersion
 * @returns {boolean}
 */
function gateAllows(gate, browserMajorVersion) {
  // `pending` = 真实 Edge 有但 NV8 未实现。任何版本都不装，但位置留在表里，
  // 实现好了只需删掉这个字段。
  if (gate.pending !== undefined) return false;
  if (gate.since !== undefined && browserMajorVersion < gate.since) return false;
  if (gate.before !== undefined && browserMajorVersion >= gate.before) return false;
  return true;
}

/**
 * 按 profile 版本筛出该装的行。
 *
 * 被排除的项必须在 `globalThis` 上不存在。这条检查是内部一致性检查，不是
 * 行为探针能覆盖的层：多一个真实 Edge 该版本没有的全局既是可识别特征，
 * 又会把其后每一个全局的枚举索引推偏一位——`FontFaceSet` 在 151 profile 下
 * 落到索引 61 就是这么来的，而当时没有任何断言看得见。
 *
 * @param {number} browserMajorVersion
 */
function planSurface(browserMajorVersion) {
  const plan = [];
  for (const entry of WINDOW_GLOBAL_ORDER) {
    const name = entry[0];
    const shape = entry[1];
    const gate = entry[2];
    if (gate !== undefined && !gateAllows(gate, browserMajorVersion)) {
      if (Object.getOwnPropertyDescriptor(globalThis, name) !== undefined) {
        throw new Error(
          "Window global " + name + " is "
          + (gate.pending === undefined
            ? "gated out of Edge " + browserMajorVersion
            : "registered as unimplemented")
          + " but present",
        );
      }
      continue;
    }
    if (!SHAPE_SET.has(shape)) {
      throw new Error("Unknown descriptor shape for Window global " + name);
    }
    plan.push(entry);
  }
  return plan;
}

/**
 * @param {number} [browserMajorVersion] profile 的 Edge 主版本号。
 *   默认 150 与 `bootstrapRoot` 的默认值一致。
 */
export function finalizeWindowSurfaceOrder(browserMajorVersion = 150) {
  const plan = planSurface(browserMajorVersion);
  const captured = new Array(plan.length);

  for (let index = 0; index < plan.length; index += 1) {
    const name = plan[index][0];
    const shape = plan[index][1];
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
    if (descriptor === undefined) {
      throw new Error("Missing Window global " + name);
    }
    // 捕获到的种类与表声明不符时必须响亮报错：表说访问器而实际是数据属性，
    // 重定义会写出一个 get/set 都是 undefined 的访问器——读它得到 undefined，
    // 而 descriptor 形状看起来「对」。这是静默错误数据，不是形状偏差。
    const isAccessor = descriptor.get !== undefined || descriptor.set !== undefined;
    if (isAccessor !== shape.accessor) {
      throw new Error(
        "Window global " + name + " is "
        + (isAccessor ? "an accessor" : "a data property")
        + " but the surface table declares the opposite",
      );
    }
    captured[index] = descriptor;
  }

  for (let index = 0; index < plan.length; index += 1) {
    const name = plan[index][0];
    if (!Reflect.deleteProperty(globalThis, name)) {
      throw new Error("Cannot reorder Window global " + name);
    }
  }

  for (let index = 0; index < plan.length; index += 1) {
    const name = plan[index][0];
    const shape = plan[index][1];
    const descriptor = captured[index];
    if (shape.accessor) {
      Object.defineProperty(globalThis, name, {
        get: descriptor.get,
        set: descriptor.set,
        enumerable: shape.enumerable,
        configurable: shape.configurable,
      });
    } else {
      Object.defineProperty(globalThis, name, {
        value: descriptor.value,
        writable: shape.writable,
        enumerable: shape.enumerable,
        configurable: shape.configurable,
      });
    }
  }
}
