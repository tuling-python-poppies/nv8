// css 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { mediaListMethod } from "./media-list-method.js";

export const item = mediaListMethod("item", 1, (record, args) =>
  record.values[Number(args[0]) >>> 0] ?? null);
export const toString = mediaListMethod("toString", 0, record => record.values.join(", "));
export const values = mediaListMethod("values", 0, record => record.values.values());
