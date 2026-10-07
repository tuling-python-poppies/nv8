export * from "./canvas-2d-context-draw-focus-if-needed.js";
import { canvasContextMethod } from "./canvas-2d-context-method.js";
import {
  appendPathOperation,
  beginPathOperation,
  clearRectOperation,
  noResult,
  closePathOperation,
  createConicGradientOperation,
  createImageDataOperation,
  createLinearGradientOperation,
  createPatternOperation,
  createRadialGradientOperation,
  drawImageOperation,
  fillRectOperation,
  fillTextOperation,
  fillOperation,
  getContextAttributesOperation,
  getImageDataOperation,
  getLineDashOperation,
  getTransformOperation,
  isContextLostOperation,
  isPointInPathOperation,
  isPointInStrokeOperation,
  measureTextOperation,
  putImageDataOperation,
  resetTransformOperation,
  resetOperation,
  restoreOperation,
  rotateOperation,
  saveOperation,
  scaleOperation,
  setLineDashOperation,
  setTransformOperation,
  strokeRectOperation,
  strokeTextOperation,
  strokeOperation,
  transformOperation,
  translateOperation,
} from "./canvas-2d-context-operations.js";
export const arc = canvasContextMethod("arc", 5, appendPathOperation("arc", 6, 5));
export const arcTo = canvasContextMethod("arcTo", 5, appendPathOperation("arcTo", 5));
export const beginPath = canvasContextMethod("beginPath", 0, beginPathOperation);
export const bezierCurveTo = canvasContextMethod(
  "bezierCurveTo",
  6,
  appendPathOperation("bezierCurveTo", 6),
);
export const clearRect = canvasContextMethod("clearRect", 4, clearRectOperation);
export const clip = canvasContextMethod("clip", 0, noResult);
export const closePath = canvasContextMethod("closePath", 0, closePathOperation);
export const createConicGradient = canvasContextMethod("createConicGradient", 3, createConicGradientOperation);
export const createImageData = canvasContextMethod("createImageData", 1, createImageDataOperation);
export const createLinearGradient = canvasContextMethod("createLinearGradient", 4, createLinearGradientOperation);
export const createPattern = canvasContextMethod("createPattern", 2, createPatternOperation);
export const createRadialGradient = canvasContextMethod("createRadialGradient", 6, createRadialGradientOperation);
export const drawImage = canvasContextMethod("drawImage", 3, drawImageOperation);
export const ellipse = canvasContextMethod(
  "ellipse",
  7,
  appendPathOperation("ellipse", 8, 7),
);
export const fill = canvasContextMethod("fill", 0, fillOperation);
export const fillRect = canvasContextMethod("fillRect", 4, fillRectOperation);
export const fillText = canvasContextMethod("fillText", 3, fillTextOperation);
export const getContextAttributes = canvasContextMethod("getContextAttributes", 0, getContextAttributesOperation);
export const getImageData = canvasContextMethod("getImageData", 4, getImageDataOperation);
export const getLineDash = canvasContextMethod("getLineDash", 0, getLineDashOperation);
export const getTransform = canvasContextMethod("getTransform", 0, getTransformOperation);
export const isContextLost = canvasContextMethod("isContextLost", 0, isContextLostOperation);
export const isPointInPath = canvasContextMethod("isPointInPath", 2, isPointInPathOperation);
export const isPointInStroke = canvasContextMethod("isPointInStroke", 2, isPointInStrokeOperation);
export const lineTo = canvasContextMethod("lineTo", 2, appendPathOperation("lineTo", 2));
export const measureText = canvasContextMethod("measureText", 1, measureTextOperation);
export const moveTo = canvasContextMethod("moveTo", 2, appendPathOperation("moveTo", 2));
export const putImageData = canvasContextMethod(
  "putImageData",
  3,
  putImageDataOperation,
);
export const quadraticCurveTo = canvasContextMethod(
  "quadraticCurveTo",
  4,
  appendPathOperation("quadraticCurveTo", 4),
);
export const rect = canvasContextMethod("rect", 4, appendPathOperation("rect", 4));
export const reset = canvasContextMethod("reset", 0, resetOperation);
export const resetTransform = canvasContextMethod(
  "resetTransform",
  0,
  resetTransformOperation,
);
export const restore = canvasContextMethod("restore", 0, restoreOperation);
export const rotate = canvasContextMethod("rotate", 1, rotateOperation);
export const roundRect = canvasContextMethod(
  "roundRect",
  4,
  appendPathOperation("roundRect", 4),
);
export const save = canvasContextMethod("save", 0, saveOperation);
export const scale = canvasContextMethod("scale", 2, scaleOperation);
export const setLineDash = canvasContextMethod("setLineDash", 1, setLineDashOperation);
export const setTransform = canvasContextMethod(
  "setTransform",
  0,
  setTransformOperation,
);
export const stroke = canvasContextMethod("stroke", 0, strokeOperation);
export const strokeRect = canvasContextMethod("strokeRect", 4, strokeRectOperation);
export const strokeText = canvasContextMethod("strokeText", 3, strokeTextOperation);
export const transform = canvasContextMethod("transform", 6, transformOperation);
export const translate = canvasContextMethod("translate", 2, translateOperation);
import { canvasContextReadonlyProperty } from "./canvas-2d-context-property.js";

export const canvas = canvasContextReadonlyProperty("canvas", state => state.canvas);

import { canvasContextProperty } from "./canvas-2d-context-property.js";

const CANVAS_CONTEXT_PROPERTY_TABLE_ROWS = [
  ["direction"],
  ["fillStyle"],
  ["filter"],
  ["fontKerning"],
  ["font"],
  ["fontStretch"],
  ["fontVariantCaps"],
  ["globalAlpha"],
  ["globalCompositeOperation"],
  ["imageSmoothingEnabled"],
  ["imageSmoothingQuality"],
  ["lang"],
  ["letterSpacing"],
  ["lineCap"],
  ["lineDashOffset"],
  ["lineJoin"],
  ["lineWidth"],
  ["miterLimit"],
  ["shadowBlur"],
  ["shadowColor"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["strokeStyle"],
  ["textAlign"],
  ["textBaseline"],
  ["textRendering"],
  ["wordSpacing"],
];

export const canvasContextPropertyTable = CANVAS_CONTEXT_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, canvasContextProperty(name, ...args)],
);
