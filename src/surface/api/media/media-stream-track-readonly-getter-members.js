// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaStreamTrackReadonlyGetter } from "./media-stream-track-readonly-getter.js";

const MEDIA_STREAM_TRACK_READONLY_GETTER_PART1_TABLE_ROWS = [
  ["kind", "kind"],
  ["id", "id"],
  ["label", "label"],
];

export const mediaStreamTrackReadonlyGetterPart1Table = MEDIA_STREAM_TRACK_READONLY_GETTER_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackReadonlyGetter(...args)],
);

const MEDIA_STREAM_TRACK_READONLY_GETTER_PART2_TABLE_ROWS = [
  ["muted", "muted"],
];

export const mediaStreamTrackReadonlyGetterPart2Table = MEDIA_STREAM_TRACK_READONLY_GETTER_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackReadonlyGetter(...args)],
);

const MEDIA_STREAM_TRACK_READONLY_GETTER_PART3_TABLE_ROWS = [
  ["readyState", "readyState"],
];

export const mediaStreamTrackReadonlyGetterPart3Table = MEDIA_STREAM_TRACK_READONLY_GETTER_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackReadonlyGetter(...args)],
);

const MEDIA_STREAM_TRACK_READONLY_GETTER_PART4_TABLE_ROWS = [
  ["stats", "stats"],
];

export const mediaStreamTrackReadonlyGetterPart4Table = MEDIA_STREAM_TRACK_READONLY_GETTER_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaStreamTrackReadonlyGetter(...args)],
);
