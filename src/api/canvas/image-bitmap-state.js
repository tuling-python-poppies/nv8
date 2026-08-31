import { ImageBitmap } from "./image-bitmap-constructor.js";

const imageBitmapState = new WeakMap();

export function createImageBitmap(width, height, pixels) {
  const bitmap = Object.create(ImageBitmap.prototype);
  imageBitmapState.set(bitmap, {
    width: Number(width) >>> 0,
    height: Number(height) >>> 0,
    pixels: new Uint8ClampedArray(pixels),
    closed: false,
  });
  return bitmap;
}

export function requireImageBitmap(bitmap) {
  const state = imageBitmapState.get(bitmap);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

export function snapshotImageBitmap(bitmap) {
  const state = requireImageBitmap(bitmap);
  if (state.closed) return undefined;
  return {
    width: state.width,
    height: state.height,
    pixels: new Uint8ClampedArray(state.pixels),
  };
}

export function takeImageBitmapPixels(bitmap) {
  const state = imageBitmapState.get(bitmap);
  if (state === undefined) return undefined;
  if (state.closed) {
    return {
      width: 0,
      height: 0,
      pixels: new Uint8ClampedArray(),
    };
  }
  const pixels = state.pixels;
  state.closed = true;
  state.pixels = new Uint8ClampedArray();
  return {
    width: state.width,
    height: state.height,
    pixels,
  };
}
