// animation 的成员表：名字就能描述实现，不再一个成员一个文件。

import { animationProperty } from "./animation-property.js";

const ANIMATION_PROPERTY_TABLE_ROWS = [
  ["currentTime", "currentTime"],
  ["effect", "effect"],
  ["id", "id"],
  ["oncancel", "oncancel"],
  ["onfinish", "onfinish"],
  ["onremove", "onremove"],
  ["playbackRate", "playbackRate"],
  ["rangeEnd", "rangeEnd"],
  ["rangeStart", "rangeStart"],
  ["startTime", "startTime"],
  ["timeline", "timeline"],
];

export const animationPropertyTable = ANIMATION_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, animationProperty(...args)],
);

