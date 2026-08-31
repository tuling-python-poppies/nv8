import { traceConstruct } from "../../trace/trace-function.js";
import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { DOMException } from "../event/dom-exception-constructor.js";
import { initializeImageData } from "./image-data-state.js";

export function ImageData(first, second) {
  if (new.target === undefined || arguments.length < 2) {
    throw new TypeError("Failed to construct 'ImageData': 2 arguments required");
  }
  let width;
  let height;
  let data;
  let settings;
  if (first instanceof Uint8ClampedArray) {
    data = first;
    width = Number(second) >>> 0;
    if (width === 0) indexSize("The source width is zero or not a number.");
    if (arguments[2] === undefined) {
      const rowLength = width * 4;
      if (data.length % rowLength !== 0) {
        indexSize("The input data length is not a multiple of (4 * width).");
      }
      height = data.length / rowLength;
    } else {
      height = Number(arguments[2]) >>> 0;
    }
    if (height === 0) indexSize("The source height is zero or not a number.");
    if (data.length !== width * height * 4) {
      indexSize("The input data length does not match width and height.");
    }
    settings = arguments[3];
  } else {
    width = Number(first) >>> 0;
    height = Number(second) >>> 0;
    if (width === 0) indexSize("The source width is zero or not a number.");
    if (height === 0) indexSize("The source height is zero or not a number.");
    settings = arguments[2];
    data = new Uint8ClampedArray(width * height * 4);
  }
  const colorSpace = setting(settings, "colorSpace", "srgb", ["srgb", "display-p3"]);
  const pixelFormat = setting(
    settings,
    "pixelFormat",
    "rgba-unorm8",
    ["rgba-unorm8", "rgba-float16"],
  );
  if (pixelFormat !== "rgba-unorm8") {
    throw new TypeError(
      "ImageData with Uint8ClampedArray requires pixelFormat 'rgba-unorm8'",
    );
  }
  initializeImageData(this, width, height, data, colorSpace, pixelFormat);
  traceConstruct("window.ImageData", [...arguments], "ImageData");
}
registerNativeFunction(ImageData, "ImageData");

export function installImageDataConstructor() {
  delete ImageData.prototype.constructor;
  defineGlobalConstructor("ImageData", ImageData);
}

function indexSize(message) {
  throw new DOMException(message, "IndexSizeError");
}

function setting(settings, name, fallback, valid) {
  const value = settings === null || settings === undefined || settings[name] === undefined
    ? fallback
    : `${settings[name]}`;
  if (!valid.includes(value)) {
    throw new TypeError(`The provided value '${value}' is not a valid ${name} value`);
  }
  return value;
}
