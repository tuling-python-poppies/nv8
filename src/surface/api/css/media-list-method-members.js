// css 的成员表：名字就能描述实现，不再一个成员一个文件。

import { mediaListMethod } from "./media-list-method.js";

const MEDIA_LIST_METHOD_TABLE_ROWS = [
  ["item", "item", 1, (record, args) =>
  record.values[Number(args[0]) >>> 0] ?? null],
  ["toString", "toString", 0, record => record.values.join(", ")],
  ["values", "values", 0, record => record.values.values()],
];

export const mediaListMethodTable = MEDIA_LIST_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, mediaListMethod(...args)],
);

