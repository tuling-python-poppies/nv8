// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { areaURLComponentProperty } from "./html-area-element-url-state.js";

const AREA_URLCOMPONENT_PROPERTY_TABLE_ROWS = [
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

export const areaURLComponentPropertyTable = AREA_URLCOMPONENT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, areaURLComponentProperty(...args)],
);

