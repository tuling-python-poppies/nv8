// animation 的成员表：名字就能描述实现，不再一个成员一个文件。

import { keyframeEffectProperty } from "./keyframe-effect-property.js";
import {
  setKeyframeComposite,
  setKeyframePseudoElement,
  setKeyframeTarget,
} from "./keyframe-effect-state.js";

const KEYFRAME_EFFECT_PROPERTY_TABLE_ROWS = [
  ["composite", "composite", setKeyframeComposite],
  ["pseudoElement", "pseudoElement", setKeyframePseudoElement],
  ["target", "target", setKeyframeTarget],
];

export const keyframeEffectPropertyTable = KEYFRAME_EFFECT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, keyframeEffectProperty(...args)],
);

