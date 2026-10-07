// animation 的成员表：名字就能描述实现，不再一个成员一个文件。

import { animationTimelineGetter } from "./animation-timeline-property.js";

const ANIMATION_TIMELINE_GETTER_TABLE_ROWS = [
  ["currentTime", "currentTime"],
  ["duration", "duration"],
];

export const animationTimelineGetterTable = ANIMATION_TIMELINE_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, animationTimelineGetter(...args)],
);
