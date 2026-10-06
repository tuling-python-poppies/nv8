// canvas 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { offscreenCanvasMethod } from "./offscreen-canvas-method.js";
import {
  offscreenCanvasBlob,
  getOffscreenCanvasContext,
  offscreenCanvasBitmap,
} from "./offscreen-canvas-state.js";

export const convertToBlob = offscreenCanvasMethod(
  "convertToBlob",
  0,
  (canvas, args) => Promise.resolve(offscreenCanvasBlob(canvas, args[0])),
);
export const getContext = offscreenCanvasMethod(
  "getContext",
  1,
  (canvas, args) => getOffscreenCanvasContext(canvas, args[0], args[1]),
);
export const transferToImageBitmap = offscreenCanvasMethod(
  "transferToImageBitmap",
  0,
  canvas => offscreenCanvasBitmap(canvas),
);
