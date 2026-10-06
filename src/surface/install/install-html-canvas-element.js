import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLCanvasElement,
  installHTMLCanvasElementConstructor,
} from "../api/canvas/html-canvas-element-constructor.js";
import { toBlob } from "../api/canvas/html-canvas-element-to-blob.js";
import { toDataURL } from "../api/canvas/html-canvas-element-to-data-url.js";
import { htmlCanvasDimensionPropertyTable } from "../api/canvas/html-canvas-dimension-property-members.js";
import { htmlCanvasMethodTable } from "../api/canvas/html-canvas-method-members.js";

export function installHTMLCanvasElement() {
  installHTMLCanvasElementConstructor();
  for (const [name, entry] of htmlCanvasDimensionPropertyTable) definePrototypeAccessor(HTMLCanvasElement.prototype, name, entry.get, entry.set);
  for (const [name, entry] of htmlCanvasMethodTable) definePrototypeMethod(HTMLCanvasElement.prototype, name, entry);
  definePrototypeMethod(HTMLCanvasElement.prototype, "toBlob", toBlob);
  definePrototypeMethod(HTMLCanvasElement.prototype, "toDataURL", toDataURL);
  defineConstructorBacklink(HTMLCanvasElement.prototype, HTMLCanvasElement);
  defineToStringTag(HTMLCanvasElement.prototype, "HTMLCanvasElement");
}
