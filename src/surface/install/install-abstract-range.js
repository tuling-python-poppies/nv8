import {
  finishAbstractRangeConstructor,
  installAbstractRangeConstructor,
  AbstractRange,
} from "../api/dom/abstract-range-constructor.js";
import {
  collapsed,
} from "../api/dom/abstract-range-collapsed-getter.js";
import {
  endContainer,
} from "../api/dom/abstract-range-end-container-getter.js";
import {
  endOffset,
} from "../api/dom/abstract-range-end-offset-getter.js";
import {
  startContainer,
} from "../api/dom/abstract-range-start-container-getter.js";
import {
  startOffset,
} from "../api/dom/abstract-range-start-offset-getter.js";
import { definePrototypeGetter } from "../../engine/webidl/descriptor.js";

/**
 * @param {boolean} [edge152Surface] Edge 152 起 `startContainer` / `endContainer`
 *   **从 `AbstractRange.prototype` 移到了 `NodeRange.prototype`**。
 *
 *   实测 152 的 `AbstractRange.prototype` 只剩 `startOffset` / `endOffset` /
 *   `collapsed` / `constructor`。这两个成员不是被删掉，是换了挂载点——`Range` 与
 *   `StaticRange` 通过 `→ NodeRange → AbstractRange` 的链仍然有它们，
 *   而 `OpaqueRange`（直接挂在 `AbstractRange` 下）就没有。
 *
 *   152 时由 `install-edge-152-ranges.js` 挂到 `NodeRange` 上，共用同一份 getter。
 */
export function installAbstractRange(edge152Surface = false) {
  installAbstractRangeConstructor();
  if (!edge152Surface) {
    definePrototypeGetter(AbstractRange.prototype, "startContainer", startContainer);
  }
  definePrototypeGetter(AbstractRange.prototype, "startOffset", startOffset);
  if (!edge152Surface) {
    definePrototypeGetter(AbstractRange.prototype, "endContainer", endContainer);
  }
  definePrototypeGetter(AbstractRange.prototype, "endOffset", endOffset);
  definePrototypeGetter(AbstractRange.prototype, "collapsed", collapsed);
  finishAbstractRangeConstructor();
}
