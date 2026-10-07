// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { offscreenCanvasProperty } from "./offscreen-canvas-property.js";
import { setOffscreenCanvasHandler } from "./offscreen-canvas-state.js";

const OFFSCREEN_CANVAS_PROPERTY_TABLE_ROWS = [
  ["oncontextlost", "oncontextlost", state => state.oncontextlost, (canvas, value) => setOffscreenCanvasHandler(canvas, "oncontextlost", value)],
  ["oncontextrestored", "oncontextrestored", state => state.oncontextrestored, (canvas, value) => setOffscreenCanvasHandler(canvas, "oncontextrestored", value)],
];

export const offscreenCanvasPropertyTable = OFFSCREEN_CANVAS_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, offscreenCanvasProperty(...args)],
);
