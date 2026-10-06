// file 的成员表：名字就能描述实现，不再一个成员一个文件。

import { blobProperty } from "./blob-property.js";

const BLOB_PROPERTY_TABLE_ROWS = [
  ["size", "size", state => state.bytes.length],
  ["type", "type", state => state.type],
];

export const blobPropertyTable = BLOB_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, blobProperty(...args)],
);

