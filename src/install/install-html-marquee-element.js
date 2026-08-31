import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { behavior, setBehavior } from "../api/dom/html-marquee-element-behavior-property.js";
import { bgColor, setBgColor } from "../api/dom/html-marquee-element-bg-color-property.js";
import {
  HTMLMarqueeElement,
  installHTMLMarqueeElementConstructor,
} from "../api/dom/html-marquee-element-constructor.js";
import { direction, setDirection } from "../api/dom/html-marquee-element-direction-property.js";
import { height, setHeight } from "../api/dom/html-marquee-element-height-property.js";
import { hspace, setHspace } from "../api/dom/html-marquee-element-hspace-property.js";
import { loop, setLoop } from "../api/dom/html-marquee-element-loop-property.js";
import { scrollAmount, setScrollAmount } from "../api/dom/html-marquee-element-scroll-amount-property.js";
import { scrollDelay, setScrollDelay } from "../api/dom/html-marquee-element-scroll-delay-property.js";
import { start } from "../api/dom/html-marquee-element-start.js";
import { stop } from "../api/dom/html-marquee-element-stop.js";
import { trueSpeed, setTrueSpeed } from "../api/dom/html-marquee-element-true-speed-property.js";
import { vspace, setVspace } from "../api/dom/html-marquee-element-vspace-property.js";
import { width, setWidth } from "../api/dom/html-marquee-element-width-property.js";
export function installHTMLMarqueeElement() {
  installHTMLMarqueeElementConstructor();
  accessor("behavior", behavior, setBehavior);
  accessor("bgColor", bgColor, setBgColor);
  accessor("direction", direction, setDirection);
  accessor("height", height, setHeight);
  accessor("hspace", hspace, setHspace);
  accessor("loop", loop, setLoop);
  accessor("scrollAmount", scrollAmount, setScrollAmount);
  accessor("scrollDelay", scrollDelay, setScrollDelay);
  accessor("trueSpeed", trueSpeed, setTrueSpeed);
  accessor("vspace", vspace, setVspace);
  accessor("width", width, setWidth);
  definePrototypeMethod(HTMLMarqueeElement.prototype, "start", start);
  definePrototypeMethod(HTMLMarqueeElement.prototype, "stop", stop);
  defineConstructorBacklink(HTMLMarqueeElement.prototype, HTMLMarqueeElement);
  defineToStringTag(HTMLMarqueeElement.prototype, "HTMLMarqueeElement");
}
function accessor(name, get, set) {
  definePrototypeAccessor(HTMLMarqueeElement.prototype, name, get, set);
}
