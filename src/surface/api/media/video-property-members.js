// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { videoProperty } from "./html-video-element-property.js";

const VIDEO_PROPERTY_TABLE_ROWS = [
  ["disablePictureInPicture", "disablePictureInPicture", Boolean],
  ["height", "height", value => Number(value) >>> 0],
  ["playsInline", "playsInline", Boolean],
  ["poster", "poster", value => `${value}`],
  ["width", "width", value => Number(value) >>> 0],
];

export const videoPropertyTable = VIDEO_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, videoProperty(...args)],
);

