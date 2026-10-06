// canvas 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { pathCommand } from "./path-2d-command.js";

export const bezierCurveTo = pathCommand(
  "bezierCurveTo",
  6,
  values => values.slice(0, 6).map(Number),
);
export const closePath = pathCommand("closePath", 0, () => []);
export const lineTo = pathCommand(
  "lineTo",
  2,
  values => [Number(values[0]), Number(values[1])],
);
export const moveTo = pathCommand(
  "moveTo",
  2,
  values => [Number(values[0]), Number(values[1])],
);
export const quadraticCurveTo = pathCommand(
  "quadraticCurveTo",
  4,
  values => values.slice(0, 4).map(Number),
);
export const rect = pathCommand(
  "rect",
  4,
  values => values.slice(0, 4).map(Number),
);
export const roundRect = pathCommand(
  "roundRect",
  4,
  values => [
    Number(values[0]),
    Number(values[1]),
    Number(values[2]),
    Number(values[3]),
    values[4] === undefined ? 0 : Number(values[4]),
  ],
);
