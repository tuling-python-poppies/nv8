// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaStreamHandlerProperty } from "./media-stream-handler-property.js";

const MEDIA_STREAM_HANDLER_PROPERTY_TABLE_ROWS = [
  ["onactive", "onactive"],
  ["onaddtrack", "onaddtrack"],
  ["oninactive", "oninactive"],
  ["onremovetrack", "onremovetrack"],
];

export const mediaStreamHandlerPropertyTable = MEDIA_STREAM_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamHandlerProperty(...args)],
);

