// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaHandlerProperty } from "./html-media-element-property.js";

const MEDIA_HANDLER_PROPERTY_TABLE_ROWS = [
  ["onencrypted", "onencrypted"],
  ["onwaitingforkey", "onwaitingforkey"],
];

export const mediaHandlerPropertyTable = MEDIA_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaHandlerProperty(...args)],
);

