// file 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { blobMethod } from "./blob-method.js";
import { decodeUtf8 } from "./blob-state.js";

export const arrayBuffer = blobMethod(
  "arrayBuffer",
  state => Promise.resolve(state.bytes.slice().buffer),
);
export const bytes = blobMethod(
  "bytes",
  state => Promise.resolve(state.bytes.slice()),
);
export const text = blobMethod(
  "text",
  state => Promise.resolve(decodeUtf8(state.bytes)),
);
