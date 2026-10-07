// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlElementMethod } from "./html-element-method.js";
import {
  htmlElementInternals,
  setHTMLPopoverVisible,
} from "./html-element-state.js";

const HTML_ELEMENT_METHOD_PART1_TABLE_ROWS = [
  ["attachInternals", "attachInternals", 0, htmlElementInternals],
];

export const htmlElementMethodPart1Table = HTML_ELEMENT_METHOD_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlElementMethod(...args)],
);

const HTML_ELEMENT_METHOD_PART2_TABLE_ROWS = [
  ["hidePopover", "hidePopover", 0, element => setHTMLPopoverVisible(element, false)],
  ["showPopover", "showPopover", 0, element => setHTMLPopoverVisible(element, true)],
];

export const htmlElementMethodPart2Table = HTML_ELEMENT_METHOD_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlElementMethod(...args)],
);
