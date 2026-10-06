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
import { dimensionPropertyTable } from "../api/canvas/dimension-property-members.js";
import { offscreenCanvasMethodTable } from "../api/canvas/offscreen-canvas-method-members.js";
import { offscreenCanvasPropertyTable } from "../api/canvas/offscreen-canvas-property-members.js";

export function installOffscreenCanvas() {
  installOffscreenCanvasConstructor();
  for (const [name, entry] of dimensionPropertyTable) definePrototypeAccessor(OffscreenCanvas.prototype, name, entry.get, entry.set);for (const [name, entry] of offscreenCanvasPropertyTable) definePrototypeAccessor( OffscreenCanvas.prototype, name, entry.get, entry.set, );for (const [name, entry] of offscreenCanvasMethodTable) definePrototypeMethod(OffscreenCanvas.prototype, name, entry);for (const [name, entry] of offscreenCanvasMethodTable) definePrototypeMethod( OffscreenCanvas.prototype, name, entry, );
  defineConstructorBacklink(OffscreenCanvas.prototype, OffscreenCanvas);
  defineToStringTag(OffscreenCanvas.prototype, "OffscreenCanvas");
}
