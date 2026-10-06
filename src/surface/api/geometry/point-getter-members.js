// geometry 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { pointGetter } from "./dom-point-property.js";

export const w = pointGetter("w");
export const x = pointGetter("x");
export const y = pointGetter("y");
export const z = pointGetter("z");
