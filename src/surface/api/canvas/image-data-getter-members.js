// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { imageDataGetter } from "./image-data-getter.js";

const IMAGE_DATA_GETTER_TABLE_ROWS = [
  ["colorSpace"],
  ["data"],
  ["height"],
  ["pixelFormat"],
  ["width"],
];

export const imageDataGetterTable = IMAGE_DATA_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, imageDataGetter(name, ...args)],
);
