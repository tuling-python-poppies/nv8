// dom 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { htmlElementMethod } from "./html-element-method.js";
import {
  htmlElementInternals,
  setHTMLPopoverVisible,
} from "./html-element-state.js";

export const attachInternals = htmlElementMethod("attachInternals", 0, htmlElementInternals);
export const hidePopover = htmlElementMethod("hidePopover", 0, element => setHTMLPopoverVisible(element, false));
export const showPopover = htmlElementMethod("showPopover", 0, element => setHTMLPopoverVisible(element, true));
