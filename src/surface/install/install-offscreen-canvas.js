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
import {
  convertToBlob,
  getContext,
  transferToImageBitmap,
} from "../api/canvas/offscreen-canvas-method-members.js";
import {
  oncontextlost,
  setOncontextlost,
} from "../api/canvas/offscreen-canvas-oncontextlost-property.js";
import {
  oncontextrestored,
  setOncontextrestored,
} from "../api/canvas/offscreen-canvas-oncontextrestored-property.js";
import { dimensionPropertyTable } from "../api/canvas/dimension-property-members.js";

export function installOffscreenCanvas() {
  installOffscreenCanvasConstructor();
  for (const [name, entry] of dimensionPropertyTable) definePrototypeAccessor(OffscreenCanvas.prototype, name, entry.get, entry.set);
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
