// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";

const ANCHOR_URLCOMPONENT_PROPERTY_TABLE_ROWS = [
  ["protocol", "protocol"],
  ["username", "username"],
  ["password", "password"],
  ["host", "host"],
  ["hostname", "hostname"],
  ["port", "port"],
  ["pathname", "pathname"],
  ["search", "search"],
  ["hash", "hash"],
];

export const anchorURLComponentPropertyTable = ANCHOR_URLCOMPONENT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, anchorURLComponentProperty(...args)],
);
