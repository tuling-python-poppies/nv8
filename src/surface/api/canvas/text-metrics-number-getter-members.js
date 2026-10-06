// canvas 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { textMetricsNumberGetter } from "./text-metrics-number-getter.js";

export const hangingBaseline = textMetricsNumberGetter("hangingBaseline");
export const width = textMetricsNumberGetter("width");
