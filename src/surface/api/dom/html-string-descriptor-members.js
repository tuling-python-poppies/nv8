// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlStringDescriptor } from "./html-element-property.js";

const HTML_STRING_DESCRIPTOR_PART1_TABLE_ROWS = [
  ["title", "title", ""],
  ["lang", "lang", ""],
];

export const htmlStringDescriptorPart1Table = HTML_STRING_DESCRIPTOR_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART2_TABLE_ROWS = [
  ["dir", "dir", ""],
];

export const htmlStringDescriptorPart2Table = HTML_STRING_DESCRIPTOR_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART3_TABLE_ROWS = [
  ["accessKey", "accessKey", ""],
];

export const htmlStringDescriptorPart3Table = HTML_STRING_DESCRIPTOR_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART4_TABLE_ROWS = [
  ["autocapitalize", "autocapitalize", ""],
];

export const htmlStringDescriptorPart4Table = HTML_STRING_DESCRIPTOR_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART5_TABLE_ROWS = [
  ["contentEditable", "contentEditable", "inherit"],
  ["enterKeyHint", "enterKeyHint", ""],
];

export const htmlStringDescriptorPart5Table = HTML_STRING_DESCRIPTOR_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART6_TABLE_ROWS = [
  ["inputMode", "inputMode", ""],
  ["virtualKeyboardPolicy", "virtualKeyboardPolicy", ""],
];

export const htmlStringDescriptorPart6Table = HTML_STRING_DESCRIPTOR_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART7_TABLE_ROWS = [
  ["writingSuggestions", "writingSuggestions", ""],
];

export const htmlStringDescriptorPart7Table = HTML_STRING_DESCRIPTOR_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART8_TABLE_ROWS = [
  ["nonce", "nonce", ""],
];

export const htmlStringDescriptorPart8Table = HTML_STRING_DESCRIPTOR_PART8_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART9_TABLE_ROWS = [
  ["focusGroup", "focusGroup", ""],
  ["focusGroupStart", "focusGroupStart", ""],
];

export const htmlStringDescriptorPart9Table = HTML_STRING_DESCRIPTOR_PART9_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART10_TABLE_ROWS = [
  ["nonce", "nonce", ""],
];

export const htmlStringDescriptorPart10Table = HTML_STRING_DESCRIPTOR_PART10_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);

const HTML_STRING_DESCRIPTOR_PART11_TABLE_ROWS = [
  ["focusGroup", "focusGroup", ""],
  ["focusGroupStart", "focusGroupStart", ""],
];

export const htmlStringDescriptorPart11Table = HTML_STRING_DESCRIPTOR_PART11_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStringDescriptor(...args)],
);
