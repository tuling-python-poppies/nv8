// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { videoProperty } from "./html-video-element-property.js";

const VIDEO_PROPERTY_PART1_TABLE_ROWS = [
  ["width", "width", value => Number(value) >>> 0],
  ["height", "height", value => Number(value) >>> 0],
];

export const videoPropertyPart1Table = VIDEO_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, videoProperty(...args)],
);

const VIDEO_PROPERTY_PART2_TABLE_ROWS = [
  ["poster", "poster", value => `${value}`],
];

export const videoPropertyPart2Table = VIDEO_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, videoProperty(...args)],
);

const VIDEO_PROPERTY_PART3_TABLE_ROWS = [
  ["playsInline", "playsInline", Boolean],
];

export const videoPropertyPart3Table = VIDEO_PROPERTY_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, videoProperty(...args)],
);

const VIDEO_PROPERTY_PART4_TABLE_ROWS = [
  ["disablePictureInPicture", "disablePictureInPicture", Boolean],
];

export const videoPropertyPart4Table = VIDEO_PROPERTY_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, videoProperty(...args)],
);
