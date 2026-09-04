import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { activeCues } from "../api/media/text-track-active-cues-getter.js";
import { addCue } from "../api/media/text-track-add-cue.js";
import {
  TextTrack,
  installTextTrackConstructor,
} from "../api/media/text-track-constructor.js";
import { cues } from "../api/media/text-track-cues-getter.js";
import { id } from "../api/media/text-track-id-getter.js";
import { kind } from "../api/media/text-track-kind-getter.js";
import { label } from "../api/media/text-track-label-getter.js";
import { language } from "../api/media/text-track-language-getter.js";
import { mode, setMode } from "../api/media/text-track-mode-property.js";
import { oncuechange, setOncuechange } from "../api/media/text-track-oncuechange-property.js";
import { removeCue } from "../api/media/text-track-remove-cue.js";

export function installTextTrack() {
  installTextTrackConstructor();
  definePrototypeGetter(TextTrack.prototype, "kind", kind);
  definePrototypeGetter(TextTrack.prototype, "label", label);
  definePrototypeGetter(TextTrack.prototype, "language", language);
  definePrototypeGetter(TextTrack.prototype, "id", id);
  definePrototypeAccessor(TextTrack.prototype, "mode", mode, setMode);
  definePrototypeGetter(TextTrack.prototype, "cues", cues);
  definePrototypeGetter(TextTrack.prototype, "activeCues", activeCues);
  definePrototypeAccessor(
    TextTrack.prototype,
    "oncuechange",
    oncuechange,
    setOncuechange,
  );
  definePrototypeMethod(TextTrack.prototype, "addCue", addCue);
  definePrototypeMethod(TextTrack.prototype, "removeCue", removeCue);
  defineConstructorBacklink(TextTrack.prototype, TextTrack);
  defineToStringTag(TextTrack.prototype, "TextTrack");
}
