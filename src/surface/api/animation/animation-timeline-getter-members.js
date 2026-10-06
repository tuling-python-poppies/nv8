// animation 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { animationTimelineGetter } from "./animation-timeline-property.js";

export const currentTime = animationTimelineGetter("currentTime");
export const duration = animationTimelineGetter("duration");
