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

export function installAbstractRange() {
  installAbstractRangeConstructor();
  definePrototypeGetter(AbstractRange.prototype, "startContainer", startContainer);
  definePrototypeGetter(AbstractRange.prototype, "startOffset", startOffset);
  definePrototypeGetter(AbstractRange.prototype, "endContainer", endContainer);
  definePrototypeGetter(AbstractRange.prototype, "endOffset", endOffset);
  definePrototypeGetter(AbstractRange.prototype, "collapsed", collapsed);
  finishAbstractRangeConstructor();
}
