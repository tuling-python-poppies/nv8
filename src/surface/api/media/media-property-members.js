// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaProperty } from "./html-media-element-property.js";

const MEDIA_PROPERTY_PART1_TABLE_ROWS = [
  ["currentTime", "currentTime", value => Math.max(0, Number(value))],
];

export const mediaPropertyPart1Table = MEDIA_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaProperty(...args)],
);

const MEDIA_PROPERTY_PART2_TABLE_ROWS = [
  ["defaultPlaybackRate", "defaultPlaybackRate", Number],
  ["playbackRate", "playbackRate", Number],
];

export const mediaPropertyPart2Table = MEDIA_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaProperty(...args)],
);

const MEDIA_PROPERTY_PART3_TABLE_ROWS = [
  ["autoplay", "autoplay", Boolean],
  ["loop", "loop", Boolean],
  ["preservesPitch", "preservesPitch", Boolean],
  ["controls", "controls", Boolean],
];

export const mediaPropertyPart3Table = MEDIA_PROPERTY_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaProperty(...args)],
);

const MEDIA_PROPERTY_PART4_TABLE_ROWS = [
  ["muted", "muted", Boolean],
  ["defaultMuted", "defaultMuted", Boolean],
];

export const mediaPropertyPart4Table = MEDIA_PROPERTY_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaProperty(...args)],
);

const MEDIA_PROPERTY_PART5_TABLE_ROWS = [
  ["loading", "loading", value => `${value}` === "lazy" ? "lazy" : "eager"],
];

export const mediaPropertyPart5Table = MEDIA_PROPERTY_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaProperty(...args)],
);

const MEDIA_PROPERTY_PART6_TABLE_ROWS = [
  ["disableRemotePlayback", "disableRemotePlayback", Boolean],
];

export const mediaPropertyPart6Table = MEDIA_PROPERTY_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaProperty(...args)],
);
