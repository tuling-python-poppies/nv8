// animation 的成员表：名字就能描述实现，不再一个成员一个文件。

import { animationProperty } from "./animation-property.js";

const ANIMATION_PROPERTY_PART1_TABLE_ROWS = [
  ["effect", "effect"],
  ["timeline", "timeline"],
  ["startTime", "startTime"],
  ["currentTime", "currentTime"],
  ["playbackRate", "playbackRate"],
  ["rangeStart", "rangeStart"],
  ["rangeEnd", "rangeEnd"],
];

export const animationPropertyPart1Table = ANIMATION_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, animationProperty(...args)],
);

const ANIMATION_PROPERTY_PART2_TABLE_ROWS = [
  ["id", "id"],
  ["onfinish", "onfinish"],
  ["oncancel", "oncancel"],
  ["onremove", "onremove"],
];

export const animationPropertyPart2Table = ANIMATION_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, animationProperty(...args)],
);
