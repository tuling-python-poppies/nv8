import { createBlob } from "../file/blob-state.js";
import { encodeCanvasPng } from "./canvas-png.js";
import { htmlCanvasMethod } from "./html-canvas-element-method.js";
import { snapshotHTMLCanvas } from "./html-canvas-element-state.js";

export const toBlob = htmlCanvasMethod("toBlob", 1, (canvas, args) => {
  const callback = args[0];
  if (typeof callback !== "function") {
    throw new TypeError("The callback must be a function");
  }
  const snapshot = snapshotHTMLCanvas(canvas);
  if (snapshot.width === 0 || snapshot.height === 0) {
    callback(null);
    return;
  }
  callback(createBlob(
    encodeCanvasPng(snapshot.width, snapshot.height, snapshot.pixels),
    "image/png",
  ));
});
