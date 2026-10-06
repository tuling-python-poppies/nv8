// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { linkTokenListProperty } from "./html-link-element-token-list.js";

const LINK_TOKEN_LIST_PROPERTY_TABLE_ROWS = [
  ["blocking", "blocking", "blocking"],
  ["relList", "relList", "rel"],
  ["sizes", "sizes", "sizes"],
];

export const linkTokenListPropertyTable = LINK_TOKEN_LIST_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, linkTokenListProperty(...args)],
);

