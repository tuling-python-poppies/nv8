// animation 的成员表：名字就能描述实现，不再一个成员一个文件。

import { animationMethod } from "./animation-method.js";
import {
  cancelAnimation,
  commitAnimationStyles,
  finishAnimation,
  pauseAnimation,
  persistAnimation,
  playAnimation,
  reverseAnimation,
  updateAnimationPlaybackRate,
} from "./animation-state.js";

const ANIMATION_METHOD_TABLE_ROWS = [
  ["cancel", "cancel", 0, animation => cancelAnimation(animation)],
  ["commitStyles", "commitStyles", 0, animation => commitAnimationStyles(animation)],
  ["finish", "finish", 0, animation => finishAnimation(animation)],
  ["pause", "pause", 0, animation => pauseAnimation(animation)],
  ["persist", "persist", 0, animation => persistAnimation(animation)],
  ["play", "play", 0, animation => playAnimation(animation)],
  ["reverse", "reverse", 0, animation => reverseAnimation(animation)],
  ["updatePlaybackRate", "updatePlaybackRate", 1, (animation, args) => updateAnimationPlaybackRate(animation, args[0])],
];

export const animationMethodTable = ANIMATION_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, animationMethod(...args)],
);

