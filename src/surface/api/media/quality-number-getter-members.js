// media 的成员表：名字就能描述实现，不再一个成员一个文件。

import { qualityNumberGetter } from "./video-playback-quality-number-getter.js";

const QUALITY_NUMBER_GETTER_TABLE_ROWS = [
  ["corruptedVideoFrames", "corruptedVideoFrames"],
  ["creationTime", "creationTime"],
  ["droppedVideoFrames", "droppedVideoFrames"],
  ["totalVideoFrames", "totalVideoFrames"],
];

export const qualityNumberGetterTable = QUALITY_NUMBER_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, qualityNumberGetter(...args)],
);

