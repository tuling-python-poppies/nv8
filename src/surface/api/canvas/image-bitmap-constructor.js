import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function ImageBitmap() {
  throw new TypeError(
    "Failed to construct 'ImageBitmap': Illegal constructor",
  );
}
registerNativeFunction(ImageBitmap, "ImageBitmap");

export function installImageBitmapConstructor() {
  delete ImageBitmap.prototype.constructor;
  defineGlobalConstructor("ImageBitmap", ImageBitmap);
}
