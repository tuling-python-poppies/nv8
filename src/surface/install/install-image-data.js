import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  colorSpace,
  data,
  height,
  pixelFormat,
  width,
} from "../api/canvas/image-data-getter-members.js";
import {
  ImageData,
  installImageDataConstructor,
} from "../api/canvas/image-data-constructor.js";

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
