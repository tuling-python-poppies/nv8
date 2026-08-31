import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { close } from "../api/canvas/image-bitmap-close.js";
import {
  ImageBitmap,
  installImageBitmapConstructor,
} from "../api/canvas/image-bitmap-constructor.js";
import { height } from "../api/canvas/image-bitmap-height-getter.js";
import { width } from "../api/canvas/image-bitmap-width-getter.js";

export function installImageBitmap() {
  installImageBitmapConstructor();
  definePrototypeGetter(ImageBitmap.prototype, "width", width);
  definePrototypeGetter(ImageBitmap.prototype, "height", height);
  definePrototypeMethod(ImageBitmap.prototype, "close", close);
  defineConstructorBacklink(ImageBitmap.prototype, ImageBitmap);
  defineToStringTag(ImageBitmap.prototype, "ImageBitmap");
}
