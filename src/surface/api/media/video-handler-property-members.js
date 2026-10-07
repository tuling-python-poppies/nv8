// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { videoHandlerProperty } from "./html-video-element-property.js";

const VIDEO_HANDLER_PROPERTY_TABLE_ROWS = [
  ["onenterpictureinpicture", "onenterpictureinpicture"],
  ["onleavepictureinpicture", "onleavepictureinpicture"],
];

export const videoHandlerPropertyTable = VIDEO_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, videoHandlerProperty(...args)],
);
