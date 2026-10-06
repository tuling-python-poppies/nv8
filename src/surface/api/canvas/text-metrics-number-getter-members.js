// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { textMetricsNumberGetter } from "./text-metrics-number-getter.js";

const TEXT_METRICS_NUMBER_GETTER_TABLE_ROWS = [
  ["hangingBaseline"],
  ["width"],
];

export const textMetricsNumberGetterTable = TEXT_METRICS_NUMBER_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, textMetricsNumberGetter(name, ...args)],
);

