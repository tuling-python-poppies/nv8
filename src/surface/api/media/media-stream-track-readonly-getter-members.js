// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaStreamTrackReadonlyGetter } from "./media-stream-track-readonly-getter.js";

const MEDIA_STREAM_TRACK_READONLY_GETTER_TABLE_ROWS = [
  ["id", "id"],
  ["kind", "kind"],
  ["label", "label"],
  ["muted", "muted"],
  ["readyState", "readyState"],
  ["stats", "stats"],
];

export const mediaStreamTrackReadonlyGetterTable = MEDIA_STREAM_TRACK_READONLY_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackReadonlyGetter(...args)],
);

