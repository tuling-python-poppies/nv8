import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  installMediaQueryListConstructor,
  MediaQueryList,
} from "../api/css/media-query-list-constructor.js";
import { media } from "../api/css/media-query-list-media-getter.js";
import { matches } from "../api/css/media-query-list-matches-getter.js";
import { onchange } from "../api/css/media-query-list-onchange-property.js";
import { addListener } from "../api/css/media-query-list-add-listener.js";
import { removeListener } from "../api/css/media-query-list-remove-listener.js";

export function installMediaQueryList() {
  installMediaQueryListConstructor();
  definePrototypeGetter(MediaQueryList.prototype, "media", media);
  definePrototypeGetter(MediaQueryList.prototype, "matches", matches);
  definePrototypeAccessor(MediaQueryList.prototype, "onchange", onchange.get, onchange.set);
  definePrototypeMethod(MediaQueryList.prototype, "addListener", addListener);
  definePrototypeMethod(MediaQueryList.prototype, "removeListener", removeListener);
  defineConstructorBacklink(MediaQueryList.prototype, MediaQueryList);
  defineToStringTag(MediaQueryList.prototype, "MediaQueryList");
}
