import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { captureStream } from "../api/canvas/html-canvas-element-capture-stream.js";
import {
  HTMLCanvasElement,
  installHTMLCanvasElementConstructor,
} from "../api/canvas/html-canvas-element-constructor.js";
import { getContext } from "../api/canvas/html-canvas-element-get-context.js";
import {
  height,
  setHeight,
} from "../api/canvas/html-canvas-element-height-property.js";
import { toBlob } from "../api/canvas/html-canvas-element-to-blob.js";
import { toDataURL } from "../api/canvas/html-canvas-element-to-data-url.js";
import {
  transferControlToOffscreen,
} from "../api/canvas/html-canvas-element-transfer-control-to-offscreen.js";
import {
  width,
  setWidth,
} from "../api/canvas/html-canvas-element-width-property.js";

export function installHTMLCanvasElement() {
  installHTMLCanvasElementConstructor();
  definePrototypeAccessor(HTMLCanvasElement.prototype, "width", width, setWidth);
  definePrototypeAccessor(HTMLCanvasElement.prototype, "height", height, setHeight);
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
