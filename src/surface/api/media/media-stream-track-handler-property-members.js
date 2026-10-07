// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaStreamTrackHandlerProperty } from "./media-stream-track-handler-property.js";

const MEDIA_STREAM_TRACK_HANDLER_PROPERTY_PART1_TABLE_ROWS = [
  ["onmute", "onmute"],
  ["onunmute", "onunmute"],
];

export const mediaStreamTrackHandlerPropertyPart1Table = MEDIA_STREAM_TRACK_HANDLER_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackHandlerProperty(...args)],
);

const MEDIA_STREAM_TRACK_HANDLER_PROPERTY_PART2_TABLE_ROWS = [
  ["onended", "onended"],
];

export const mediaStreamTrackHandlerPropertyPart2Table = MEDIA_STREAM_TRACK_HANDLER_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackHandlerProperty(...args)],
);

const MEDIA_STREAM_TRACK_HANDLER_PROPERTY_PART3_TABLE_ROWS = [
  ["oncapturehandlechange", "oncapturehandlechange"],
];

export const mediaStreamTrackHandlerPropertyPart3Table = MEDIA_STREAM_TRACK_HANDLER_PROPERTY_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackHandlerProperty(...args)],
);
