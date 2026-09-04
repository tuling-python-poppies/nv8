import { ImageData } from "./image-data-constructor.js";

const imageDataState = new WeakMap();

export function initializeImageData(
  imageData,
  width,
  height,
  data,
  colorSpace = "srgb",
  pixelFormat = "rgba-unorm8",
) {
  imageDataState.set(imageData, {
    width,
    height,
    colorSpace,
    data,
    pixelFormat,
  });
}

export function createImageData(
  width,
  height,
  data = new Uint8ClampedArray(width * height * 4),
  colorSpace = "srgb",
) {
  const imageData = Object.create(ImageData.prototype);
  initializeImageData(
    imageData,
    width,
    height,
    data,
    colorSpace,
    "rgba-unorm8",
  );
  return imageData;
}

export function requireImageData(imageData) {
  const state = imageDataState.get(imageData);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}
