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
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
} from "../api/dom/string-reflection-html-marquee-element-members.js";
import {
  marqueeNumberReflectionPart1Table,
  marqueeNumberReflectionPart2Table,
} from "../api/dom/marquee-number-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/html-marquee-element-true-speed-property.js";

export function installHTMLMarqueeElement() {
  installHTMLMarqueeElementConstructor();
  for (const [name, entry] of stringReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of marqueeNumberReflectionPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of marqueeNumberReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart2Table) accessor(name, entry.get, entry.set);
  definePrototypeMethod(HTMLMarqueeElement.prototype, "start", start);
  definePrototypeMethod(HTMLMarqueeElement.prototype, "stop", stop);
  defineConstructorBacklink(HTMLMarqueeElement.prototype, HTMLMarqueeElement);
  defineToStringTag(HTMLMarqueeElement.prototype, "HTMLMarqueeElement");
}
function accessor(name, get, set) {
  definePrototypeAccessor(HTMLMarqueeElement.prototype, name, get, set);
}
