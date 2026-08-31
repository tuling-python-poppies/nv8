import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  HTMLTrackElement,
  installHTMLTrackElementConstructor,
} from "../api/dom/html-track-element-constructor.js";
import { defaultEnabled, setDefault } from "../api/dom/html-track-element-default-property.js";
import { kind, setKind } from "../api/dom/html-track-element-kind-property.js";
import { label, setLabel } from "../api/dom/html-track-element-label-property.js";
import { readyState } from "../api/dom/html-track-element-ready-state-getter.js";
import { src, setSrc } from "../api/dom/html-track-element-src-property.js";
import { srclang, setSrclang } from "../api/dom/html-track-element-srclang-property.js";
import {
  TRACK_ERROR,
  TRACK_LOADED,
  TRACK_LOADING,
  TRACK_NONE,
} from "../api/dom/html-track-element-state.js";
import { track } from "../api/dom/html-track-element-track-getter.js";

export function installHTMLTrackElement() {
  installHTMLTrackElementConstructor();
  accessor("kind", kind, setKind);
  accessor("src", src, setSrc);
  accessor("srclang", srclang, setSrclang);
  accessor("label", label, setLabel);
  accessor("default", defaultEnabled, setDefault);
  definePrototypeGetter(HTMLTrackElement.prototype, "readyState", readyState);
  definePrototypeGetter(HTMLTrackElement.prototype, "track", track);
  constant(HTMLTrackElement.prototype, "NONE", TRACK_NONE);
  constant(HTMLTrackElement.prototype, "LOADING", TRACK_LOADING);
  constant(HTMLTrackElement.prototype, "LOADED", TRACK_LOADED);
  constant(HTMLTrackElement.prototype, "ERROR", TRACK_ERROR);
  defineConstructorBacklink(HTMLTrackElement.prototype, HTMLTrackElement);
  defineToStringTag(HTMLTrackElement.prototype, "HTMLTrackElement");
  constant(HTMLTrackElement, "NONE", TRACK_NONE);
  constant(HTMLTrackElement, "LOADING", TRACK_LOADING);
  constant(HTMLTrackElement, "LOADED", TRACK_LOADED);
  constant(HTMLTrackElement, "ERROR", TRACK_ERROR);
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTrackElement.prototype, name, getter, setter);
}

function constant(target, name, value) {
  Object.defineProperty(target, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
