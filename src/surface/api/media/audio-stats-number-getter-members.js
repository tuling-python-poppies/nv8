// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { audioStatsNumberGetter } from "./media-stream-track-audio-stats-number-getter.js";

const AUDIO_STATS_NUMBER_GETTER_TABLE_ROWS = [
  ["deliveredFrames", "deliveredFrames"],
  ["deliveredFramesDuration", "deliveredFramesDuration"],
  ["totalFrames", "totalFrames"],
  ["totalFramesDuration", "totalFramesDuration"],
  ["latency", "latency"],
  ["averageLatency", "averageLatency"],
  ["minimumLatency", "minimumLatency"],
  ["maximumLatency", "maximumLatency"],
];

export const audioStatsNumberGetterTable = AUDIO_STATS_NUMBER_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, audioStatsNumberGetter(...args)],
);
