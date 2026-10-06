// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { videoReadonlyProperty } from "./html-video-element-property.js";

const VIDEO_READONLY_PROPERTY_TABLE_ROWS = [
  ["videoHeight", "videoHeight"],
  ["videoWidth", "videoWidth"],
];

export const videoReadonlyPropertyTable = VIDEO_READONLY_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, videoReadonlyProperty(...args)],
);

