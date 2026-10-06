import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  captureStream,
  getContext,
  transferControlToOffscreen,
} from "../api/canvas/html-canvas-method-members.js";
import {
  HTMLCanvasElement,
  installHTMLCanvasElementConstructor,
} from "../api/canvas/html-canvas-element-constructor.js";
import { toBlob } from "../api/canvas/html-canvas-element-to-blob.js";
import { toDataURL } from "../api/canvas/html-canvas-element-to-data-url.js";
import { htmlCanvasDimensionPropertyTable } from "../api/canvas/html-canvas-dimension-property-members.js";

export function installHTMLCanvasElement() {
  installHTMLCanvasElementConstructor();
  for (const [name, entry] of htmlCanvasDimensionPropertyTable) definePrototypeAccessor(HTMLCanvasElement.prototype, name, entry.get, entry.set);
  definePrototypeMethod(HTMLCanvasElement.prototype, "captureStream", captureStream);
  definePrototypeMethod(HTMLCanvasElement.prototype, "getContext", getContext);
  definePrototypeMethod(HTMLCanvasElement.prototype, "toBlob", toBlob);
  definePrototypeMethod(HTMLCanvasElement.prototype, "toDataURL", toDataURL);
  definePrototypeMethod(
    HTMLCanvasElement.prototype,
    "transferControlToOffscreen",
    transferControlToOffscreen,
  );
  defineConstructorBacklink(HTMLCanvasElement.prototype, HTMLCanvasElement);
  defineToStringTag(HTMLCanvasElement.prototype, "HTMLCanvasElement");
}
