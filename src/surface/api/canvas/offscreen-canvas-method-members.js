// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { offscreenCanvasMethod } from "./offscreen-canvas-method.js";
import {
  offscreenCanvasBlob,
  getOffscreenCanvasContext,
  offscreenCanvasBitmap,
} from "./offscreen-canvas-state.js";

const OFFSCREEN_CANVAS_METHOD_PART1_TABLE_ROWS = [
  ["convertToBlob", "convertToBlob", 0, (canvas, args) => Promise.resolve(offscreenCanvasBlob(canvas, args[0]))],
  ["getContext", "getContext", 1, (canvas, args) => getOffscreenCanvasContext(canvas, args[0], args[1])],
];

export const offscreenCanvasMethodPart1Table = OFFSCREEN_CANVAS_METHOD_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, offscreenCanvasMethod(...args)],
);

const OFFSCREEN_CANVAS_METHOD_PART2_TABLE_ROWS = [
  ["transferToImageBitmap", "transferToImageBitmap", 0, canvas => offscreenCanvasBitmap(canvas)],
];

export const offscreenCanvasMethodPart2Table = OFFSCREEN_CANVAS_METHOD_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, offscreenCanvasMethod(...args)],
);
