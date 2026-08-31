import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  TextTrackCueList,
  installTextTrackCueListConstructor,
} from "../api/media/text-track-cue-list-constructor.js";
import { getCueById } from "../api/media/text-track-cue-list-get-cue-by-id.js";
import { length } from "../api/media/text-track-cue-list-length-getter.js";
import { values } from "../api/media/text-track-cue-list-values.js";

export function installTextTrackCueList() {
  installTextTrackCueListConstructor();
  definePrototypeGetter(TextTrackCueList.prototype, "length", length);
  definePrototypeMethod(TextTrackCueList.prototype, "getCueById", getCueById);
  defineConstructorBacklink(TextTrackCueList.prototype, TextTrackCueList);
  defineToStringTag(TextTrackCueList.prototype, "TextTrackCueList");
  Object.defineProperty(TextTrackCueList.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
