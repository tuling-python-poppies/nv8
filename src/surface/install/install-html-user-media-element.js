import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLUserMediaElement,
  installHTMLUserMediaElementConstructor,
} from "../api/dom/html-user-media-element-constructor.js";
import {
  error,
  oncancel,
  onerror,
  onstream,
  setOncancel,
  setOnerror,
  setOnstream,
  setConstraints,
  stream,
} from "../api/dom/html-user-media-element-members.js";

export function installHTMLUserMediaElement() {
  installHTMLUserMediaElementConstructor();
  defineConstructorBacklink(HTMLUserMediaElement.prototype, HTMLUserMediaElement);
  defineToStringTag(HTMLUserMediaElement.prototype, "HTMLUserMediaElement");
  definePrototypeGetter(HTMLUserMediaElement.prototype, "error", error);
  definePrototypeAccessor(HTMLUserMediaElement.prototype, "oncancel", oncancel, setOncancel);
  definePrototypeAccessor(HTMLUserMediaElement.prototype, "onerror", onerror, setOnerror);
  definePrototypeAccessor(HTMLUserMediaElement.prototype, "onstream", onstream, setOnstream);
  definePrototypeMethod(HTMLUserMediaElement.prototype, "setConstraints", setConstraints);
  definePrototypeGetter(HTMLUserMediaElement.prototype, "stream", stream);
}
