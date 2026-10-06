// animation 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

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

export const cancel = animationMethod("cancel", 0, animation => cancelAnimation(animation));
export const commitStyles = animationMethod("commitStyles", 0, animation => commitAnimationStyles(animation));
export const finish = animationMethod("finish", 0, animation => finishAnimation(animation));
export const pause = animationMethod("pause", 0, animation => pauseAnimation(animation));
export const persist = animationMethod("persist", 0, animation => persistAnimation(animation));
export const play = animationMethod("play", 0, animation => playAnimation(animation));
export const reverse = animationMethod("reverse", 0, animation => reverseAnimation(animation));
export const updatePlaybackRate = animationMethod("updatePlaybackRate", 1, (animation, args) => updateAnimationPlaybackRate(animation, args[0]));
