import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  TextTrackList,
  installTextTrackListConstructor,
} from "../api/media/text-track-list-constructor.js";
import { getTrackById } from "../api/media/text-track-list-get-track-by-id.js";
import { length } from "../api/media/text-track-list-length-getter.js";
import { onaddtrack, setOnaddtrack } from "../api/media/text-track-list-onaddtrack-property.js";
import { onchange, setOnchange } from "../api/media/text-track-list-onchange-property.js";
import { onremovetrack, setOnremovetrack } from "../api/media/text-track-list-onremovetrack-property.js";
import { values } from "../api/media/text-track-list-values.js";
export function installTextTrackList() {
  installTextTrackListConstructor();
  definePrototypeGetter(TextTrackList.prototype, "length", length);
  definePrototypeAccessor(TextTrackList.prototype, "onchange", onchange, setOnchange);
  definePrototypeAccessor(TextTrackList.prototype, "onaddtrack", onaddtrack, setOnaddtrack);
  definePrototypeAccessor(TextTrackList.prototype, "onremovetrack", onremovetrack, setOnremovetrack);
  definePrototypeMethod(TextTrackList.prototype, "getTrackById", getTrackById);
  defineConstructorBacklink(TextTrackList.prototype, TextTrackList);
  defineToStringTag(TextTrackList.prototype, "TextTrackList");
  Object.defineProperty(TextTrackList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
