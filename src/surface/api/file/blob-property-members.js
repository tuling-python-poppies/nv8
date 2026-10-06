// file 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { blobProperty } from "./blob-property.js";

export const size = blobProperty("size", state => state.bytes.length);
export const type = blobProperty("type", state => state.type);
