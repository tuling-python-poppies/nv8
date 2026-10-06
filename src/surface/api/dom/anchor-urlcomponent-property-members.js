// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";

const ANCHOR_URLCOMPONENT_PROPERTY_TABLE_ROWS = [
  ["hash", "hash"],
  ["host", "host"],
  ["hostname", "hostname"],
  ["password", "password"],
  ["pathname", "pathname"],
  ["port", "port"],
  ["protocol", "protocol"],
  ["search", "search"],
  ["username", "username"],
];

export const anchorURLComponentPropertyTable = ANCHOR_URLCOMPONENT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, anchorURLComponentProperty(...args)],
);

