import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { installMediaListConstructor, MediaList } from "../api/css/media-list-constructor.js";
import { length } from "../api/css/media-list-length-getter.js";
import { mediaText } from "../api/css/media-list-media-text-property.js";
import { appendMedium } from "../api/css/media-list-append-medium.js";
import { deleteMedium } from "../api/css/media-list-delete-medium.js";
import { item } from "../api/css/media-list-item.js";
import { toString } from "../api/css/media-list-to-string.js";
import { values } from "../api/css/media-list-values.js";

export function installMediaList() {
  installMediaListConstructor();
  definePrototypeGetter(MediaList.prototype, "length", length);
  definePrototypeAccessor(MediaList.prototype, "mediaText", mediaText.get, mediaText.set);
  definePrototypeMethod(MediaList.prototype, "appendMedium", appendMedium);
  definePrototypeMethod(MediaList.prototype, "deleteMedium", deleteMedium);
  definePrototypeMethod(MediaList.prototype, "item", item);
  definePrototypeMethod(MediaList.prototype, "toString", toString);
  defineConstructorBacklink(MediaList.prototype, MediaList);
  defineToStringTag(MediaList.prototype, "MediaList");
  Object.defineProperty(MediaList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    configurable: true,
  });
}
