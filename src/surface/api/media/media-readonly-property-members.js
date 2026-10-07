// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaReadonlyProperty } from "./html-media-element-property.js";

const MEDIA_READONLY_PROPERTY_PART1_TABLE_ROWS = [
  ["error", "error", () => null],
];

export const mediaReadonlyPropertyPart1Table = MEDIA_READONLY_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART2_TABLE_ROWS = [
  ["currentSrc", "currentSrc"],
];

export const mediaReadonlyPropertyPart2Table = MEDIA_READONLY_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART3_TABLE_ROWS = [
  ["networkState", "networkState"],
];

export const mediaReadonlyPropertyPart3Table = MEDIA_READONLY_PROPERTY_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART4_TABLE_ROWS = [
  ["readyState", "readyState"],
  ["seeking", "seeking"],
];

export const mediaReadonlyPropertyPart4Table = MEDIA_READONLY_PROPERTY_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART5_TABLE_ROWS = [
  ["duration", "duration"],
  ["paused", "paused"],
];

export const mediaReadonlyPropertyPart5Table = MEDIA_READONLY_PROPERTY_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART6_TABLE_ROWS = [
  ["ended", "ended"],
];

export const mediaReadonlyPropertyPart6Table = MEDIA_READONLY_PROPERTY_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART7_TABLE_ROWS = [
  ["textTracks", "textTracks"],
];

export const mediaReadonlyPropertyPart7Table = MEDIA_READONLY_PROPERTY_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART8_TABLE_ROWS = [
  ["sinkId", "sinkId"],
  ["remote", "remote"],
];

export const mediaReadonlyPropertyPart8Table = MEDIA_READONLY_PROPERTY_PART8_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

const MEDIA_READONLY_PROPERTY_PART9_TABLE_ROWS = [
  ["mediaKeys", "mediaKeys"],
];

export const mediaReadonlyPropertyPart9Table = MEDIA_READONLY_PROPERTY_PART9_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);
