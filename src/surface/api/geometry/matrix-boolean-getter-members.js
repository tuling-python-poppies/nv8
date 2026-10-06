// geometry 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { matrixBooleanGetter } from "./dom-matrix-read-only-boolean-getter.js";

export const is2D = matrixBooleanGetter("is2D");
export const isIdentity = matrixBooleanGetter("isIdentity");
