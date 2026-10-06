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
import { values } from "../api/media/text-track-list-values.js";
import { textTrackListHandlerPropertyTable } from "../api/media/text-track-list-handler-property-members.js";

export function installTextTrackList() {
  installTextTrackListConstructor();
  definePrototypeGetter(TextTrackList.prototype, "length", length);
  for (const [name, entry] of textTrackListHandlerPropertyTable) definePrototypeAccessor(TextTrackList.prototype, name, entry.get, entry.set);
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
