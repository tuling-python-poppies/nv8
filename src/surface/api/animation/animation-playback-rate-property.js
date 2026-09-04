import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("playbackRate");
export const playbackRate = descriptor.get;
export const setPlaybackRate = descriptor.set;
