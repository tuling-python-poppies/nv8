import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createDOMRect } from "../geometry/dom-rect-constructor.js";
import { createDOMRectList } from "../geometry/dom-rect-list-state.js";
import { initializeOpaqueRange, requireRange } from "./range-state.js";

/**
 * Edge 152 新增的两个 Range 子类。
 *
 * ## `NodeRange` 是插进继承链中间的一层
 *
 * 151 的链是 `Range` / `StaticRange` → `AbstractRange`。152 变成
 * `Range` / `StaticRange` → **`NodeRange`** → `AbstractRange`，而
 * `startContainer` / `endContainer` 从 `AbstractRange.prototype` **移到了**
 * `NodeRange.prototype`（实测：152 的 `AbstractRange.prototype` 只剩
 * `startOffset` / `endOffset` / `collapsed` / `constructor`）。
 *
 * 所以这两个成员不是「删掉」，是**换了挂载点**。`Range` 通过继承仍然有它们，
 * 但 `'startContainer' in someOpaqueRange` 变成了 `false`——这就是为什么
 * `OpaqueRange` 要直接挂在 `AbstractRange` 下而不是 `NodeRange` 下。
 *
 * ## `OpaqueRange` 描述的是「值里的一段」，不是「树里的一段」
 *
 * 实例来自 `input.createValueRange(start, end)` / `textarea.createValueRange()`：
 * 它指向表单控件 **value 字符串**的一段，那里没有 Node，所以没有
 * startContainer / endContainer。实测 `[object OpaqueRange]`、
 * `r instanceof AbstractRange === true`、`r instanceof NodeRange === false`。
 */

export function NodeRange() {
  if (new.target !== undefined) {
    throw new TypeError("Failed to construct 'NodeRange': Illegal constructor");
  }
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(NodeRange, "NodeRange");

export function OpaqueRange() {
  if (new.target !== undefined) {
    throw new TypeError("Failed to construct 'OpaqueRange': Illegal constructor");
  }
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(OpaqueRange, "OpaqueRange");

/**
 * 造一个 `OpaqueRange`。
 *
 * `startContainer` / `endContainer` 存 `null`：这两个字段在 `OpaqueRange` 上取不到
 * （getter 挂在 `NodeRange.prototype` 上，而 `OpaqueRange` 不继承它），但
 * `AbstractRange.prototype.collapsed` 的实现要读它们——`null === null` 让 collapsed
 * 退化成「两个 offset 是否相等」，与实测一致（`(0,3)` → false，`disconnect()`
 * 归零后 → true）。
 *
 * @param {number} startOffset
 * @param {number} endOffset
 * @returns {object}
 */
export function createOpaqueRange(startOffset, endOffset) {
  const range = Object.create(OpaqueRange.prototype);
  initializeOpaqueRange(range, startOffset, endOffset);
  return range;
}

/**
 * `disconnect()`：把范围收起来。
 *
 * 实测真实 Edge 152：调用后 `startOffset` / `endOffset` 都变 0、`collapsed` 变
 * true、`getClientRects()` 仍返回空列表。没有返回值。
 */
export function opaqueRangeDisconnect(range) {
  const state = requireRange(range);
  state.startOffset = 0;
  state.endOffset = 0;
}

/**
 * `getBoundingClientRect()` —— 恒为全 0 的 `DOMRect`。
 *
 * 没有排版引擎，返回编造的数字比返回 0 更糟：脚本拿它比宽高会得出错误结论。
 * 而真实 Edge 在 detached 的 input 上实测也是 `{x:0, y:0, width:0, height:0}`，
 * 所以这一档是对的；attached 且有布局时会不同，那属于「10 个布局相关计算值」
 * 那条刻意不做的登记。
 */
export function opaqueRangeBoundingClientRect(range) {
  requireRange(range);
  return createDOMRect(0, 0, 0, 0);
}

/** `getClientRects()` —— 空 `DOMRectList`，同上。 */
export function opaqueRangeClientRects(range) {
  requireRange(range);
  return createDOMRectList([]);
}
