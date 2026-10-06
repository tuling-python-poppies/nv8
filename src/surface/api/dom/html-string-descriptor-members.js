// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlStringDescriptor } from "./html-element-property.js";

const HTML_STRING_DESCRIPTOR_PART1_TABLE_ROWS = [
  ["title", "title", ""],
  ["lang", "lang", ""],
  ["dir", "dir", ""],
  ["accessKey", "accessKey", ""],
  ["autocapitalize", "autocapitalize", ""],
  ["contentEditable", "contentEditable", "inherit"],
  ["enterKeyHint", "enterKeyHint", ""],
  ["inputMode", "inputMode", ""],
  ["virtualKeyboardPolicy", "virtualKeyboardPolicy", ""],
  ["writingSuggestions", "writingSuggestions", ""],
  ["nonce", "nonce", ""],
  ["focusGroup", "focusGroup", ""],
  ["focusGroupStart", "focusGroupStart", ""],
];

export const htmlStringDescriptorPart1Table = HTML_STRING_DESCRIPTOR_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART2_TABLE_ROWS = [
  ["nonce", "nonce", ""],
  ["focusGroup", "focusGroup", ""],
  ["focusGroupStart", "focusGroupStart", ""],
];

export const htmlStringDescriptorPart2Table = HTML_STRING_DESCRIPTOR_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);
