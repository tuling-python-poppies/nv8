import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { takeImageBitmapPixels } from "./image-bitmap-state.js";

const contextState = new WeakMap();

export function ImageBitmapRenderingContext() {
  throw new TypeError(
    "Failed to construct 'ImageBitmapRenderingContext': Illegal constructor",
  );
}
registerNativeFunction(
  ImageBitmapRenderingContext,
  "ImageBitmapRenderingContext",
);

export function createImageBitmapRenderingContext(canvas) {
  const context = Object.create(ImageBitmapRenderingContext.prototype);
  contextState.set(context, {
    canvas,
    bitmapWidth: 0,
    bitmapHeight: 0,
    pixels: new Uint8ClampedArray(),
  });
  return context;
}

export const canvas = Object.getOwnPropertyDescriptor({
  get canvas() {
    return requireContext(this).canvas;
  },
}, "canvas").get;
registerNativeGetter(canvas, "canvas");

export function transferFromImageBitmap(bitmap) {
  const state = requireContext(this);
  let transferred;
  if (bitmap === null) {
    transferred = {
      width: 0,
      height: 0,
      pixels: new Uint8ClampedArray(),
    };
  } else {
    transferred = takeImageBitmapPixels(bitmap);
    if (transferred === undefined) {
      throw new TypeError("parameter 1 is not of type 'ImageBitmap'");
    }
  }
  state.bitmapWidth = transferred.width;
  state.bitmapHeight = transferred.height;
  state.pixels = transferred.pixels;
}
registerNativeFunction(
  transferFromImageBitmap,
  "transferFromImageBitmap",
);

export function snapshotImageBitmapRenderingContext(
  context,
  canvasWidth,
  canvasHeight,
) {
  const state = requireContext(context);
  const width = Number(canvasWidth) >>> 0;
  const height = Number(canvasHeight) >>> 0;
  const pixels = new Uint8ClampedArray(width * height * 4);
  const copyWidth = Math.min(width, state.bitmapWidth);
  const copyHeight = Math.min(height, state.bitmapHeight);
  for (let y = 0; y < copyHeight; y += 1) {
    const source = y * state.bitmapWidth * 4;
    const destination = y * width * 4;
    pixels.set(
      state.pixels.subarray(source, source + copyWidth * 4),
      destination,
    );
  }
  return { width, height, pixels };
}

function requireContext(context) {
  const state = contextState.get(context);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
