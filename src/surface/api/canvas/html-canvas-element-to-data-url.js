import { encodeBase64, encodeCanvasPng } from "./canvas-png.js";
import { htmlCanvasMethod } from "./html-canvas-element-method.js";
import { snapshotHTMLCanvas } from "./html-canvas-element-state.js";

export const toDataURL = htmlCanvasMethod("toDataURL", 0, canvas => {
  const snapshot = snapshotHTMLCanvas(canvas);
  if (snapshot.width === 0 || snapshot.height === 0) return "data:,";
  const png = encodeCanvasPng(
    snapshot.width,
    snapshot.height,
    snapshot.pixels,
  );
  return `data:image/png;base64,${encodeBase64(png)}`;
});
