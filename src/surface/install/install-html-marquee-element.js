import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLMarqueeElement,
  installHTMLMarqueeElementConstructor,
} from "../api/dom/html-marquee-element-constructor.js";
import { start } from "../api/dom/html-marquee-element-start.js";
import { stop } from "../api/dom/html-marquee-element-stop.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";
import { marqueeNumberReflectionTable } from "../api/dom/marquee-number-reflection-members.js";

export function installHTMLMarqueeElement() {
  installHTMLMarqueeElementConstructor();
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of marqueeNumberReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeMethod(HTMLMarqueeElement.prototype, "start", start);
  definePrototypeMethod(HTMLMarqueeElement.prototype, "stop", stop);
  defineConstructorBacklink(HTMLMarqueeElement.prototype, HTMLMarqueeElement);
  defineToStringTag(HTMLMarqueeElement.prototype, "HTMLMarqueeElement");
}
function accessor(name, get, set) {
  definePrototypeAccessor(HTMLMarqueeElement.prototype, name, get, set);
}
