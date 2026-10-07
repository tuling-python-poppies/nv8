// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { pathCommand } from "./path-2d-command.js";

const PATH_COMMAND_PART1_TABLE_ROWS = [
  ["roundRect", 4,
  values => [
    Number(values[0]),
    Number(values[1]),
    Number(values[2]),
    Number(values[3]),
    values[4] === undefined ? 0 : Number(values[4]),
  ],],
];

export const pathCommandPart1Table = PATH_COMMAND_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, pathCommand(name, ...args)],
);

const PATH_COMMAND_PART2_TABLE_ROWS = [
  ["bezierCurveTo", 6,
  values => values.slice(0, 6).map(Number),],
  ["closePath", 0, () => []],
];

export const pathCommandPart2Table = PATH_COMMAND_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, pathCommand(name, ...args)],
);

const PATH_COMMAND_PART3_TABLE_ROWS = [
  ["lineTo", 2,
  values => [Number(values[0]), Number(values[1])],],
  ["moveTo", 2,
  values => [Number(values[0]), Number(values[1])],],
  ["quadraticCurveTo", 4,
  values => values.slice(0, 4).map(Number),],
  ["rect", 4,
  values => values.slice(0, 4).map(Number),],
];

export const pathCommandPart3Table = PATH_COMMAND_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, pathCommand(name, ...args)],
);
