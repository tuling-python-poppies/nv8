// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { textMetricsNumberGetter } from "./text-metrics-number-getter.js";

const TEXT_METRICS_NUMBER_GETTER_PART1_TABLE_ROWS = [
  ["width"],
];

export const textMetricsNumberGetterPart1Table = TEXT_METRICS_NUMBER_GETTER_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, textMetricsNumberGetter(name, ...args)],
);

const TEXT_METRICS_NUMBER_GETTER_PART2_TABLE_ROWS = [
  ["hangingBaseline"],
];

export const textMetricsNumberGetterPart2Table = TEXT_METRICS_NUMBER_GETTER_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, textMetricsNumberGetter(name, ...args)],
);
