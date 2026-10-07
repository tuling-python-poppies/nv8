// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { areaURLComponentProperty } from "./html-area-element-url-state.js";

const AREA_URLCOMPONENT_PROPERTY_TABLE_ROWS = [
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

export const areaURLComponentPropertyTable = AREA_URLCOMPONENT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, areaURLComponentProperty(...args)],
);
