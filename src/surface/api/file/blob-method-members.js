// file 的成员表：名字就能描述实现，不再一个成员一个文件。

import { blobMethod } from "./blob-method.js";
import { decodeUtf8 } from "./blob-state.js";

const BLOB_METHOD_TABLE_ROWS = [
  ["arrayBuffer", "arrayBuffer", state => Promise.resolve(state.bytes.slice().buffer)],
  ["bytes", "bytes", state => Promise.resolve(state.bytes.slice())],
  ["text", "text", state => Promise.resolve(decodeUtf8(state.bytes))],
];

export const blobMethodTable = BLOB_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, blobMethod(...args)],
);

