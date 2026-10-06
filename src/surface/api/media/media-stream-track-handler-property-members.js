// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaStreamTrackHandlerProperty } from "./media-stream-track-handler-property.js";

const MEDIA_STREAM_TRACK_HANDLER_PROPERTY_TABLE_ROWS = [
  ["oncapturehandlechange", "oncapturehandlechange"],
  ["onended", "onended"],
  ["onmute", "onmute"],
  ["onunmute", "onunmute"],
];

export const mediaStreamTrackHandlerPropertyTable = MEDIA_STREAM_TRACK_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackHandlerProperty(...args)],
);

