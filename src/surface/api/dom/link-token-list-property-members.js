// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { linkTokenListProperty } from "./html-link-element-token-list.js";

const LINK_TOKEN_LIST_PROPERTY_PART1_TABLE_ROWS = [
  ["relList", "relList", "rel"],
];

export const linkTokenListPropertyPart1Table = LINK_TOKEN_LIST_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, linkTokenListProperty(...args)],
);

const LINK_TOKEN_LIST_PROPERTY_PART2_TABLE_ROWS = [
  ["sizes", "sizes", "sizes"],
];

export const linkTokenListPropertyPart2Table = LINK_TOKEN_LIST_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, linkTokenListProperty(...args)],
);

const LINK_TOKEN_LIST_PROPERTY_PART3_TABLE_ROWS = [
  ["blocking", "blocking", "blocking"],
];

export const linkTokenListPropertyPart3Table = LINK_TOKEN_LIST_PROPERTY_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, linkTokenListProperty(...args)],
);
