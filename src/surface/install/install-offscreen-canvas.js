import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  OffscreenCanvas,
  installOffscreenCanvasConstructor,
} from "../api/canvas/offscreen-canvas-constructor.js";
import { convertToBlob } from "../api/canvas/offscreen-canvas-convert-to-blob.js";
import { getContext } from "../api/canvas/offscreen-canvas-get-context.js";
import {
  height,
  setHeight,
} from "../api/canvas/offscreen-canvas-height-property.js";
import {
  oncontextlost,
  setOncontextlost,
} from "../api/canvas/offscreen-canvas-oncontextlost-property.js";
import {
  oncontextrestored,
  setOncontextrestored,
} from "../api/canvas/offscreen-canvas-oncontextrestored-property.js";
import {
  transferToImageBitmap,
} from "../api/canvas/offscreen-canvas-transfer-to-image-bitmap.js";
import {
  width,
  setWidth,
} from "../api/canvas/offscreen-canvas-width-property.js";

export function installOffscreenCanvas() {
  installOffscreenCanvasConstructor();
  definePrototypeAccessor(OffscreenCanvas.prototype, "width", width, setWidth);
  definePrototypeAccessor(OffscreenCanvas.prototype, "height", height, setHeight);
  definePrototypeAccessor(
    OffscreenCanvas.prototype,
    "oncontextlost",
    oncontextlost,
    setOncontextlost,
  );
  definePrototypeAccessor(
    OffscreenCanvas.prototype,
    "oncontextrestored",
    oncontextrestored,
    setOncontextrestored,
  );
  definePrototypeMethod(OffscreenCanvas.prototype, "convertToBlob", convertToBlob);
  definePrototypeMethod(OffscreenCanvas.prototype, "getContext", getContext);
  definePrototypeMethod(
    OffscreenCanvas.prototype,
    "transferToImageBitmap",
    transferToImageBitmap,
  );
  defineConstructorBacklink(OffscreenCanvas.prototype, OffscreenCanvas);
  defineToStringTag(OffscreenCanvas.prototype, "OffscreenCanvas");
}
