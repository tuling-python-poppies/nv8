// geometry 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { rectGetter } from "./dom-rect-property.js";

export const bottom = rectGetter("bottom", s => Math.max(s.y, s.y + s.height));
export const height = rectGetter("height");
export const left = rectGetter("left", s => Math.min(s.x, s.x + s.width));
export const right = rectGetter("right", s => Math.max(s.x, s.x + s.width));
export const top = rectGetter("top", s => Math.min(s.y, s.y + s.height));
export const width = rectGetter("width");
export const x = rectGetter("x");
export const y = rectGetter("y");
