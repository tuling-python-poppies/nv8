// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaReadonlyProperty } from "./html-media-element-property.js";

const MEDIA_READONLY_PROPERTY_TABLE_ROWS = [
  ["currentSrc", "currentSrc"],
  ["duration", "duration"],
  ["ended", "ended"],
  ["error", "error", () => null],
  ["mediaKeys", "mediaKeys"],
  ["networkState", "networkState"],
  ["paused", "paused"],
  ["readyState", "readyState"],
  ["remote", "remote"],
  ["seeking", "seeking"],
  ["sinkId", "sinkId"],
  ["textTracks", "textTracks"],
];

export const mediaReadonlyPropertyTable = MEDIA_READONLY_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaReadonlyProperty(...args)],
);

