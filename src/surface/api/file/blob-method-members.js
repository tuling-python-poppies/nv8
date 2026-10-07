// file 的成员表：名字就能描述实现，不再一个成员一个文件。

import { blobMethod } from "./blob-method.js";
import { decodeUtf8 } from "./blob-state.js";

const BLOB_METHOD_PART1_TABLE_ROWS = [
  ["arrayBuffer", "arrayBuffer", state => Promise.resolve(state.bytes.slice().buffer)],
];

export const blobMethodPart1Table = BLOB_METHOD_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, blobMethod(...args)],
);

const BLOB_METHOD_PART2_TABLE_ROWS = [
  ["text", "text", state => Promise.resolve(decodeUtf8(state.bytes))],
];

export const blobMethodPart2Table = BLOB_METHOD_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, blobMethod(...args)],
);

const BLOB_METHOD_PART3_TABLE_ROWS = [
  ["bytes", "bytes", state => Promise.resolve(state.bytes.slice())],
];

export const blobMethodPart3Table = BLOB_METHOD_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, blobMethod(...args)],
);
