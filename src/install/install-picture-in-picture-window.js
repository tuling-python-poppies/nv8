import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  PictureInPictureWindow,
  installPictureInPictureWindowConstructor,
} from "../api/media/picture-in-picture-window-constructor.js";
import { width } from "../api/media/picture-in-picture-window-width-getter.js";
import { height } from "../api/media/picture-in-picture-window-height-getter.js";
import { onresize, setOnresize } from "../api/media/picture-in-picture-window-onresize-property.js";

export function installPictureInPictureWindow() {
  installPictureInPictureWindowConstructor();
  definePrototypeGetter(PictureInPictureWindow.prototype, "width", width);
  definePrototypeGetter(PictureInPictureWindow.prototype, "height", height);
  definePrototypeAccessor(
    PictureInPictureWindow.prototype,
    "onresize",
    onresize,
    setOnresize,
  );
  defineConstructorBacklink(PictureInPictureWindow.prototype, PictureInPictureWindow);
  defineToStringTag(PictureInPictureWindow.prototype, "PictureInPictureWindow");
}
