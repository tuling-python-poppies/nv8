// canvas 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { htmlCanvasMethod } from "./html-canvas-element-method.js";
import {
  captureHTMLCanvasStream,
  getHTMLCanvasContext,
  transferHTMLCanvasControl,
} from "./html-canvas-element-state.js";

export const captureStream = htmlCanvasMethod(
  "captureStream",
  0,
  (canvas, args) => captureHTMLCanvasStream(canvas, args[0]),
);
export const getContext = htmlCanvasMethod(
  "getContext",
  1,
  (canvas, args) => getHTMLCanvasContext(canvas, args[0], args[1]),
);
export const transferControlToOffscreen = htmlCanvasMethod(
  "transferControlToOffscreen",
  0,
  canvas => transferHTMLCanvasControl(canvas),
);
