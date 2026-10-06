// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlCanvasMethod } from "./html-canvas-element-method.js";
import {
  captureHTMLCanvasStream,
  getHTMLCanvasContext,
  transferHTMLCanvasControl,
} from "./html-canvas-element-state.js";

const HTML_CANVAS_METHOD_TABLE_ROWS = [
  ["captureStream", "captureStream", 0, (canvas, args) => captureHTMLCanvasStream(canvas, args[0])],
  ["getContext", "getContext", 1, (canvas, args) => getHTMLCanvasContext(canvas, args[0], args[1])],
  ["transferControlToOffscreen", "transferControlToOffscreen", 0, canvas => transferHTMLCanvasControl(canvas)],
];

export const htmlCanvasMethodTable = HTML_CANVAS_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlCanvasMethod(...args)],
);

