import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { installMediaListConstructor, MediaList } from "../api/css/media-list-constructor.js";
import { length } from "../api/css/media-list-length-getter.js";
import { appendMedium } from "../api/css/media-list-append-medium.js";
import { deleteMedium } from "../api/css/media-list-delete-medium.js";
import { mediaListAccessorDescriptorTable } from "../api/css/media-list-accessor-descriptor-members.js";
import { mediaListMethodTable } from "../api/css/media-list-method-members.js";

export function installMediaList() {
  installMediaListConstructor();
  definePrototypeGetter(MediaList.prototype, "length", length);
  for (const [name, entry] of mediaListAccessorDescriptorTable) definePrototypeAccessor(MediaList.prototype, name, entry.get, entry.set);
  definePrototypeMethod(MediaList.prototype, "appendMedium", appendMedium);
  definePrototypeMethod(MediaList.prototype, "deleteMedium", deleteMedium);
  for (const [name, entry] of mediaListMethodTable) definePrototypeMethod(MediaList.prototype, name, entry);
  defineConstructorBacklink(MediaList.prototype, MediaList);
  defineToStringTag(MediaList.prototype, "MediaList");
  Object.defineProperty(MediaList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    configurable: true,
  });
}
