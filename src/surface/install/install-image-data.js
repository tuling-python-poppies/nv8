import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { colorSpace } from "../api/canvas/image-data-color-space-getter.js";
import {
  ImageData,
  installImageDataConstructor,
} from "../api/canvas/image-data-constructor.js";
import { data } from "../api/canvas/image-data-data-getter.js";
import { height } from "../api/canvas/image-data-height-getter.js";
import { pixelFormat } from "../api/canvas/image-data-pixel-format-getter.js";
import { width } from "../api/canvas/image-data-width-getter.js";

export function installImageData() {
  installImageDataConstructor();
  definePrototypeGetter(ImageData.prototype, "width", width);
  definePrototypeGetter(ImageData.prototype, "height", height);
  definePrototypeGetter(ImageData.prototype, "colorSpace", colorSpace);
  definePrototypeGetter(ImageData.prototype, "data", data);
  definePrototypeGetter(ImageData.prototype, "pixelFormat", pixelFormat);
  defineConstructorBacklink(ImageData.prototype, ImageData);
  defineToStringTag(ImageData.prototype, "ImageData");
}
