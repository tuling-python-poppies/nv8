import {
  defineConstructorBacklink,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  ImageData,
  installImageDataConstructor,
} from "../api/canvas/image-data-constructor.js";
import { imageDataGetterTable } from "../api/canvas/image-data-getter-members.js";

export function installImageData() {
  installImageDataConstructor();
  for (const [name, entry] of imageDataGetterTable) definePrototypeGetter(ImageData.prototype, name, entry);
  defineConstructorBacklink(ImageData.prototype, ImageData);
  defineToStringTag(ImageData.prototype, "ImageData");
}
