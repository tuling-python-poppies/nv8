import {
  AbstractRange,
} from "../api/dom/abstract-range-constructor.js";
import {
  NodeRange,
  OpaqueRange,
  opaqueRangeBoundingClientRect,
  opaqueRangeClientRects,
  opaqueRangeDisconnect,
} from "../api/dom/range-152-runtime.js";
import {
  endContainer,
} from "../api/dom/abstract-range-end-container-getter.js";
import {
  startContainer,
} from "../api/dom/abstract-range-start-container-getter.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../engine/webidl/native-function.js";

/**
 * Edge 152 的 `NodeRange` 与 `OpaqueRange`。
 *
 * 成员安装顺序照真实 Edge 152 的原型枚举顺序实测值：
 *
 *   NodeRange     startContainer, endContainer, constructor
 *   OpaqueRange   disconnect, getBoundingClientRect, getClientRects, constructor
 *
 * `startContainer` / `endContainer` 的 getter 与 151 共用同一份实现
 * （`abstract-range-*-getter.js`）——152 只是换了挂载点，不是换了语义。
 * 152 时它们**不再**挂到 `AbstractRange.prototype` 上，见
 * `install-abstract-range.js` 的 `edge152Surface` 分支。
 */
export function installEdge152Ranges() {
  delete NodeRange.prototype.constructor;
  Object.setPrototypeOf(NodeRange.prototype, AbstractRange.prototype);
  Object.setPrototypeOf(NodeRange, AbstractRange);
  defineGlobalConstructor("NodeRange", NodeRange);
  definePrototypeGetter(NodeRange.prototype, "startContainer", startContainer);
  definePrototypeGetter(NodeRange.prototype, "endContainer", endContainer);
  defineConstructorBacklink(NodeRange.prototype, NodeRange);
  defineToStringTag(NodeRange.prototype, "NodeRange");

  delete OpaqueRange.prototype.constructor;
  Object.setPrototypeOf(OpaqueRange.prototype, AbstractRange.prototype);
  Object.setPrototypeOf(OpaqueRange, AbstractRange);
  defineGlobalConstructor("OpaqueRange", OpaqueRange);
  method("disconnect", 0, opaqueRangeDisconnect);
  method("getBoundingClientRect", 0, opaqueRangeBoundingClientRect);
  method("getClientRects", 0, opaqueRangeClientRects);
  defineConstructorBacklink(OpaqueRange.prototype, OpaqueRange);
  defineToStringTag(OpaqueRange.prototype, "OpaqueRange");
}

function method(name, length, operation) {
  const callback = {
    [name]() {
      return operation(this);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(OpaqueRange.prototype, name, callback);
}
