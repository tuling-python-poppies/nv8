// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlElementMethod } from "./html-element-method.js";
import {
  htmlElementInternals,
  setHTMLPopoverVisible,
} from "./html-element-state.js";

const HTML_ELEMENT_METHOD_TABLE_ROWS = [
  ["attachInternals", "attachInternals", 0, htmlElementInternals],
  ["hidePopover", "hidePopover", 0, element => setHTMLPopoverVisible(element, false)],
  ["showPopover", "showPopover", 0, element => setHTMLPopoverVisible(element, true)],
];

export const htmlElementMethodTable = HTML_ELEMENT_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlElementMethod(...args)],
);

