// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlStringDescriptor } from "./html-element-property.js";

const HTML_STRING_DESCRIPTOR_TABLE_ROWS = [
  ["accessKey", "accessKey", ""],
  ["autocapitalize", "autocapitalize", ""],
  ["contentEditable", "contentEditable", "inherit"],
  ["dir", "dir", ""],
  ["enterKeyHint", "enterKeyHint", ""],
  ["focusGroup", "focusGroup", ""],
  ["focusGroupStart", "focusGroupStart", ""],
  ["inputMode", "inputMode", ""],
  ["lang", "lang", ""],
  ["nonce", "nonce", ""],
  ["title", "title", ""],
  ["virtualKeyboardPolicy", "virtualKeyboardPolicy", ""],
  ["writingSuggestions", "writingSuggestions", ""],
];

export const htmlStringDescriptorTable = HTML_STRING_DESCRIPTOR_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

